import { ChatMsgStatus, ChatType } from '@prisma/client';
import { ChatWebSocket } from 'src/utils/types';
import {
  adminMerchantChat,
  adminMerchantChatClientDetails,
  merchantAdminChatEvents,
} from '../../../utils/interfaces';
import { authenticateChat, checkUserIsReceiver } from '..';
import { queryAdminMerchantChatMsgs } from 'src/validations';
import { MerchantAdminChatService } from '../../merchant-admin-chat.service';

export * from './new-msg';
export * from './msg-status-updates';

export const getQueryMsgUpdateList = (
  results: {
    id: number;
    status: ChatMsgStatus;
    receiverId: number | null;
  }[],
  clientDetails: adminMerchantChatClientDetails,
  deliveryTime: Date,
) => {
  const statusUpdateIdList: number[] = results.reduce((list, msg) => {
    if (msg.status !== ChatMsgStatus.sent) return list;
    const isUserReceiver = checkUserIsReceiver(
      clientDetails.userId,
      clientDetails,
      msg.receiverId,
    );
    isUserReceiver && list.push(msg.id);
    return list;
  }, []);
  return {
    statusUpdateIdList,
    newResultList: results.map((chatMsg) => {
      const isStatusUpdated = statusUpdateIdList.includes(chatMsg.id);
      const additionalDetails = isStatusUpdated
        ? {
            deliveryTime,
          }
        : {};
      return {
        ...chatMsg,
        status: isStatusUpdated ? ChatMsgStatus.delivered : chatMsg.status,
        ...additionalDetails,
      };
    }),
  };
};

export const queryChatMsgs = async (
  client: ChatWebSocket,
  details: queryAdminMerchantChatMsgs,
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  merchantAdminChatService: MerchantAdminChatService,
  chatRooms: adminMerchantChat['chatRooms'],
) => {
  const currentTime = new Date();
  const clientId = client.id;
  const socketDetails = clientSocketMap[clientId];
  authenticateChat(socketDetails);

  const chatData = await merchantAdminChatService.queryAdminMerchantChat(
    {
      where: {
        chatType: ChatType.merchant_registration,
        entityModelId: socketDetails.merchantRegistrationId,
      },
      cursor: {
        id: details.cursor,
      },
      skip: 1,
    },
    {
      limit: details.limit,
    },
    client,
    clientSocketMap,
    chatRooms,
    currentTime,
  );

  return {
    ...chatData,
    event: merchantAdminChatEvents.queryChatsMsgs,
  };
};
