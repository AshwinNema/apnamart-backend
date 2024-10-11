import { WsException } from '@nestjs/websockets';
import { ChatType, Prisma } from '@prisma/client';
import {
  adminMerchantChat,
  createMerchantAdminChatMsg,
  getAdminMerchantChatUnreadMsgFilter,
  merchantAdminChatEvents,
} from 'src/communication/chat/utils';
import prisma from 'src/prisma/client';
import { ChatWebSocket } from 'src/utils/types';
import {
  broadcastByRoleUserDetails,
  broadcastMsgByUserType,
} from '../../msg-broadcast';

export const createChatMsg = async (
  details: createMerchantAdminChatMsg,
  client: ChatWebSocket,
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  chatRooms: adminMerchantChat['chatRooms'],
) => {
  const clientId = client.id;
  const clientDetails = clientSocketMap[clientId];
  const filter = {
    chatType: ChatType.merchant_registration,
    entityModelId: clientDetails.merchantRegistrationId,
  };

  const adminUnreadMsgFilter = getAdminMerchantChatUnreadMsgFilter(
    clientDetails.merchantId,
    false,
  );

  const merchantUnreadMsgFilter = getAdminMerchantChatUnreadMsgFilter(
    clientDetails.merchantId,
    true,
  );

  const maxRetries = 5;
  let retries = 0;
  let newMsg, totalResults, merchantUnreadMsgCount, adminUnreadMsgCount;
  while (retries < maxRetries) {
    try {
      const allDetails = await prisma.$transaction(
        [
          prisma.chat.create({
            data: {
              ...details,
              senderId: clientDetails.userId,
              ...filter,
            },
          }),
          prisma.chat.count({
            where: filter,
          }),
          prisma.chat.count({
            where: { ...filter, ...adminUnreadMsgFilter },
          }),
          prisma.chat.count({
            where: { ...filter, ...merchantUnreadMsgFilter },
          }),
        ],
        {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
      newMsg = allDetails[0];
      totalResults = allDetails[1];
      adminUnreadMsgCount = allDetails[2];
      merchantUnreadMsgCount = allDetails[3];
      break;
    } catch (error) {
      if (error.code === 'P2034') {
        retries++;
        continue;
      }
      throw new WsException(error.message);
    }
  }
  if (!newMsg) {
    throw new WsException('Connection timed out');
  }
  const msgDetails = ['admin', 'merchant'].map((userType) => ({
    userType,
    msg: {
      msg: newMsg,
      totalResults,
      unreadMsgCount:
        userType === 'merchant' ? merchantUnreadMsgCount : adminUnreadMsgCount,
    },
  })) as broadcastByRoleUserDetails[];

  broadcastMsgByUserType(
    chatRooms,
    clientSocketMap,
    clientDetails.merchantRegistrationId,
    msgDetails,
    merchantAdminChatEvents.sendChatMsg,
  );
};
