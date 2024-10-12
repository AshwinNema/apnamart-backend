import { ChatMsgStatus, Prisma } from '@prisma/client';
import { UserInterface } from 'src/interfaces';
import { ChatWebSocket } from 'src/utils/types';
import { adminMerchantChatRole } from 'src/validations';

export interface createMerchantAdminChatMsg {
  message: string;
  sentTime: Date;
  receiverId: number | null;
  status: ChatMsgStatus;
  deliveryTime?: Date;
}

export enum merchantAdminChatEvents {
  initiateChat = 'initiate-merchant-admin-chat',
  sendChatMsg = 'merchant-admin-chat-msg',
  queryChatsMsgs = 'query-merchant-admin-chat-msgs',
  reinitiateMerchantAdminChat = 'reinitiate-merchant-admin-chat',
  markMsgAsRead = 'merchant-admin-chat-mark-msg-read',
  messagesDelivered = 'merchant-admin-chat-msgs-delivered',
}

export interface adminMerchantChatClientDetails {
  client: ChatWebSocket;
  userId?: number;
  merchantRegistrationId?: number;
  role?: adminMerchantChatRole;
  merchantId?: number;
  isClientMerchant: boolean;
}

export interface adminMerchantChat {
  // Contains details of the socket,clientSocketId is the key that is created in the handleConnection method
  clientSocketMap: {
    [clientSocketId: string]: adminMerchantChatClientDetails;
  };
  // All chatRooms have a key of merchantRegistrationId and its value is an array of strings.
  // These strings are the keys of clientSocketMap. It stores which client are there in the current room
  chatRooms: {
    [merchantRegistrationId: string]: string[];
  };
  handleSocketConnection: {
    chatQuery: Prisma.ChatFindManyArgs;
    user: UserInterface;
    merchantRegistrationId: number;
    role: adminMerchantChatRole;
    merchantId: number;
    paginationOptions?: {
      limit: number;
    };
    event:
      | merchantAdminChatEvents.initiateChat
      | merchantAdminChatEvents.reinitiateMerchantAdminChat;
  };
}

export const webSocketReadyState = {
  '0': 'CONNECTING_STATE',
  '1': 'OPEN_STATE',
  '2': 'CLOSING_STATE',
  '3': 'CLOSED_STATE',
  CONNECTING_STATE: 0,
  OPEN_STATE: 1,
  CLOSING_STATE: 2,
  CLOSED_STATE: 3,
};
