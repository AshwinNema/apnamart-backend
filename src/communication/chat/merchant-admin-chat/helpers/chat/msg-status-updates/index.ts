import { merchantAdminChatEvents } from 'src/communication/chat/utils';
import { broadcastMsgByUserType, getQueryMsgUpdateList } from '../..';
import { ChatMsgStatus } from '@prisma/client';
export * from './mark-as-read';

export const markMsgsAsDeliveredAndGetUpdatedList = async (
  results,
  clientDetails,
  transaction,
  chatRooms,
  clientSocketMap,
  deliveryTime,
) => {
  const { statusUpdateIdList, newResultList } = getQueryMsgUpdateList(
    results,
    clientDetails,
    deliveryTime,
  );
  if (statusUpdateIdList.length) {
    await transaction.chat.updateMany({
      where: {
        id: {
          in: statusUpdateIdList,
        },
        status: ChatMsgStatus.sent,
      },
      data: {
        status: ChatMsgStatus.delivered,
        deliveryTime,
      },
    });
  }
  const msgSender = clientDetails.isClientMerchant ? 'admin' : 'merchant';
  statusUpdateIdList.length &&
    broadcastMsgByUserType(
      chatRooms,
      clientSocketMap,
      clientDetails.merchantRegistrationId,
      [
        {
          userType: msgSender,
          msg: statusUpdateIdList,
        },
      ],
      merchantAdminChatEvents.messagesDelivered,
    );

  return newResultList;
};
