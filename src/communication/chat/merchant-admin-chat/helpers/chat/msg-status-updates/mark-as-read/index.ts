import { WsException } from '@nestjs/websockets';
import {
  adminMerchantChat,
  merchantAdminChatEvents,
} from 'src/communication/chat/utils';
import { ChatWebSocket } from 'src/utils/types';
import { authenticateChat, broadcastMsgByUserType } from '../../..';
import { transactionQuery } from './transaction';

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
  const transactionDetails = await transactionQuery(
    id,
    clientDetails,
    readTime,
    throwErr,
  );
  // Entity that is marking msg as read should receive the count of unread msgs
  // and the sender of the msg should receive the status that msg has been read
  const updatedMsg = transactionDetails.updatedMsg;
  const unreadMsgCount = transactionDetails.unreadMsgCount;

  const msgReceiver = clientDetails.isClientMerchant ? 'merchant' : 'admin';
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
      {
        userType: msgReceiver,
        msg: {
          unreadMsgCount: unreadMsgCount,
        },
      },
    ],
    merchantAdminChatEvents.markMsgAsRead,
  );
};
