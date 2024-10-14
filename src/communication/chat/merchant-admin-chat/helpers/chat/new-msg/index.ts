import { ChatMsgStatus } from '@prisma/client';
import { ChatWebSocket } from 'src/utils/types';
import { adminMerchantChat } from '../../../../utils/interfaces';
import { WsException } from '@nestjs/websockets';
import { authenticateChat, checkEntitiesPresentInRoom } from '../..';
import { createChatMsg } from './create-new-msg';

export const addAdminMerchantChatMsg = async (
  message: string,
  client: ChatWebSocket,
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  chatRooms: adminMerchantChat['chatRooms'],
) => {
  const sentTime = new Date();
  if (typeof message !== 'string') {
    throw new WsException('Message should be a string');
  }
  const clientId = client.id;
  const socketDetails = clientSocketMap[clientId];
  authenticateChat(socketDetails);
  const senderId = socketDetails?.userId;
  const merchantId = socketDetails.merchantId;
  const receiverId = merchantId !== senderId ? merchantId : null;
  const { receiver } = checkEntitiesPresentInRoom(
    client,
    clientSocketMap,
    chatRooms,
  );
  const additionalDetails = receiver ? { deliveryTime: sentTime } : {};
  createChatMsg(
    {
      message,
      sentTime,
      receiverId,
      status: receiver ? ChatMsgStatus.delivered : ChatMsgStatus.sent,
      ...additionalDetails,
    },
    client,
    clientSocketMap,
    chatRooms,
  );
};
