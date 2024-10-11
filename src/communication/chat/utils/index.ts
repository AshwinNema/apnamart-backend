import { ChatMsgStatus } from '@prisma/client';
import { webSocketReadyState } from './interfaces';

export * from './interfaces';
// userId can be null in case we are sure that we want to get unread count for non merchant user
export const getAdminMerchantChatUnreadMsgFilter = (
  merchantId: number,
  isUserMerchant: boolean,
) => {
  return {
    [isUserMerchant ? 'receiverId' : 'senderId']: merchantId,
    status: {
      not: ChatMsgStatus.read,
    },
  };
};

export const checkOpenConnection = (socket: WebSocket | null) => {
  return socket?.readyState === webSocketReadyState.OPEN_STATE;
};
