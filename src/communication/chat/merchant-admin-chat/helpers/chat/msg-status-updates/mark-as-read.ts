import { WsException } from '@nestjs/websockets';
import {
  adminMerchantChat,
  merchantAdminChatEvents,
} from 'src/communication/chat/utils';
import { ChatWebSocket } from 'src/utils/types';
import {
  authenticateChat,
  checkUserIsReceiver,
  broadcastMsgByUserType,
} from '../..';
import { ChatMsgStatus, ChatType, Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';

export const markMsgAsRead = async (
  client: ChatWebSocket,
  id: number,
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  chatRooms: adminMerchantChat['chatRooms'],
) => {
  const throwErr = (message: string) => {
    throw new WsException({
      id,
      message,
    });
  };
  const readTime = new Date();
  const clientDetails = clientSocketMap[client.id];
  if (typeof id !== 'number') throwErr('Id must be a number');

  authenticateChat(clientDetails);
  const maxRetries = 5;
  let retries = 0;
  let updatedMsg;
  while (retries < maxRetries) {
    try {
      const updatedMsgDetails = await prisma.$transaction(
        async function (transaction) {
          const chatData = await transaction.chat.findFirst({
            where: {
              id,
              entityModelId: clientDetails.merchantRegistrationId,
              chatType: ChatType.merchant_registration,
            },
          });

          if (!chatData) throwErr('Chat message not found');

          if (chatData.status === ChatMsgStatus.read)
            throwErr('Message is already read');

          const isUserReceiver = checkUserIsReceiver(
            clientDetails.userId,
            clientDetails,
            chatData.receiverId,
          );
          if (!isUserReceiver)
            throwErr('User is not the receiver of the message');

          const updatedMsg = await prisma.chat.update({
            where: { id },
            data: {
              status: ChatMsgStatus.read,
              readTime,
            },
          });

          return updatedMsg;
        },
        {
          maxWait: 5000,
          timeout: 10000,
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        },
      );
      updatedMsg = updatedMsgDetails;
      break;
    } catch (error) {
      if (error.code === 'P2034') {
        retries++;
        continue;
      }
      throwErr(error.message);
    }
  }
  if (!updatedMsg) {
    throwErr('Connection timed out');
  }
  const msgSender = clientDetails.isClientMerchant ? 'admin' : 'merchant';
  broadcastMsgByUserType(
    chatRooms,
    clientSocketMap,
    clientDetails.merchantRegistrationId,
    [
      {
        userType: msgSender,
        msg: {
          id: updatedMsg.id,
        },
      },
    ],
    merchantAdminChatEvents.markMsgAsRead,
  );
};
