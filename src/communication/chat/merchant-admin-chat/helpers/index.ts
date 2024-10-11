import { ChatWebSocket } from 'src/utils/types';
import {
  adminMerchantChat,
  adminMerchantChatClientDetails,
  checkOpenConnection,
} from '../../utils';
import { WsException } from '@nestjs/websockets';

export * from './chat';
export * from './set-up';
export * from './msg-broadcast';

export const authenticateChat = (
  socketDetails: adminMerchantChatClientDetails,
) => {
  if (!socketDetails?.userId) {
    throw new WsException(
      'Please initiate the chat first before sending message',
    );
  }
};

// For checking that the passed user is the receiver of message, we first check that is merchant is the receiver of the message or not
// If merchant is the receiver of the message, this means that if user is the receiver of the message,
// then user has to be the merchant, else if receiver is not the merchant, then user also should not be the merchant
export const checkUserIsReceiver = (
  userId: number,
  clientDetails: adminMerchantChatClientDetails,
  receiverId: number | null,
) => {
  const isMerchantReceiver = receiverId === clientDetails.merchantId;
  const isUserMerchant = userId === clientDetails.merchantId;
  return isMerchantReceiver ? isUserMerchant : !isUserMerchant;
};

export const checkEntitiesPresentInRoom = (
  client: ChatWebSocket,
  clientSocketMap: adminMerchantChat['clientSocketMap'],
  chatRooms: adminMerchantChat['chatRooms'],
) => {
  let admin = false,
    merchant = false,
    receiver = false;
  const clientId = client.id;
  const clientDetails = clientSocketMap[clientId];
  const chatRoom = chatRooms[clientDetails?.merchantRegistrationId];

  chatRoom?.forEach((clientId) => {
    const chatUserDetails = clientSocketMap[clientId];
    const isSocketOpen = checkOpenConnection(chatUserDetails.client);
    if (!isSocketOpen) return;
    if (chatUserDetails.isClientMerchant) merchant = true;
    else admin = true;
    if (clientDetails.isClientMerchant && admin) receiver = true;
    if (!clientDetails.isClientMerchant && merchant) receiver = true;
  });

  return {
    admin,
    merchant,
    receiver,
  };
};
