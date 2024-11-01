import { ChatWebSocket } from 'src/utils/types';
import { adminMerchantChat } from '../../utils/interfaces';
import { MerchantAdminChatService } from '../merchant-admin-chat.service';

export const setupInitialConnection = (
  client: ChatWebSocket,
  data: adminMerchantChat['handleSocketConnection'],
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  chatRooms: adminMerchantChat['chatRooms'],
) => {
  const clientId = client.id;
  const { merchantRegistrationId, user, role, merchantId } = data;
  clientSocketMap[clientId].userId = user.id;
  clientSocketMap[clientId].merchantRegistrationId = merchantRegistrationId;
  clientSocketMap[clientId].role = role;
  clientSocketMap[clientId].merchantId = merchantId;
  clientSocketMap[clientId].isClientMerchant = merchantId === user.id;
  let chatRoom = chatRooms[merchantRegistrationId];
  if (!chatRoom) {
    chatRoom = [];
    chatRooms[merchantRegistrationId] = chatRoom;
  }
  if (!chatRoom.includes(clientId)) {
    chatRoom.push(clientId);
  }
};

export const setupSocketConnection = async (
  data: adminMerchantChat['handleSocketConnection'],
  client: ChatWebSocket,
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  chatRooms: adminMerchantChat['chatRooms'],
  merchantAdminChatService: MerchantAdminChatService,
) => {
  const deliveryTime = new Date();
  const { chatQuery, paginationOptions = {} } = data;
  setupInitialConnection(client, data, clientSocketMap, chatRooms);
  const chatData = await merchantAdminChatService.queryAdminMerchantChat(
    chatQuery,
    paginationOptions,
    client,
    clientSocketMap,
    chatRooms,
    deliveryTime,
  );

  return {
    ...chatData,
    event: data.event,
  };
};

export const handleMerchantAdminChatDisconnect = (
  client: ChatWebSocket,
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  chatRooms: adminMerchantChat['chatRooms'],
) => {
  const clientId = client?.id || '';
  const merchantRegistrationId =
    clientSocketMap[clientId]?.merchantRegistrationId || '';
  delete clientSocketMap[clientId];
  const chatRoom = chatRooms[`${merchantRegistrationId}`];
  if (!chatRoom) return;
  chatRooms[`${merchantRegistrationId}`] = chatRoom.filter(
    (socketId) => socketId !== clientId,
  );
  const isEmptyRoom = !chatRooms[`${merchantRegistrationId}`].length;
  if (isEmptyRoom) {
    delete chatRooms[`${merchantRegistrationId}`];
  }
};
