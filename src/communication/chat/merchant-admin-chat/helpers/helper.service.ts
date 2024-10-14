import { Injectable } from '@nestjs/common';
import { adminMerchantChat } from '../../utils';
import { ChatService } from '../../chat.service';
import { ChatWebSocket } from 'src/utils/types';
import { v4 as uuidv4 } from 'uuid';
import {
  addAdminMerchantChatMsg,
  handleMerchantAdminChatDisconnect,
  markMsgAsRead,
  queryChatMsgs,
} from '.';
import { setupSocketConnection } from '.';
import { queryAdminMerchantChatMsgs } from 'src/validations';
import { MerchantAdminChatService } from '../merchant-admin-chat.service';

@Injectable()
export class MerchantAdminChatHelperService {
  clientSocketMap: adminMerchantChat['clientSocketMap'];
  chatRooms: adminMerchantChat['chatRooms'];

  constructor(
    private chatService: ChatService,
    private merchantAdminChatService: MerchantAdminChatService,
  ) {
    this.clientSocketMap = {};
    this.chatRooms = {};
  }

  handleConnection(client: ChatWebSocket) {
    const id = uuidv4();
    client.id = id;
    this.clientSocketMap[id] = {
      client,
      isClientMerchant: false,
    };
  }

  handleDisconnect(client: ChatWebSocket) {
    handleMerchantAdminChatDisconnect(
      client,
      this.clientSocketMap,
      this.chatRooms,
    );
  }

  initiateChat(
    client: ChatWebSocket,
    data: adminMerchantChat['handleSocketConnection'],
  ) {
    return setupSocketConnection(
      data,
      client,
      this.clientSocketMap,
      this.chatRooms,
      this.merchantAdminChatService,
    );
  }

  sendChatMsg(client: ChatWebSocket, message: string) {
    addAdminMerchantChatMsg(
      message,
      client,
      this.clientSocketMap,
      this.chatRooms,
    );
  }

  queryChatMessages(
    client: ChatWebSocket,
    details: queryAdminMerchantChatMsgs,
  ) {
    return queryChatMsgs(
      client,
      details,
      this.clientSocketMap,
      this.merchantAdminChatService,
      this.chatRooms,
    );
  }

  async markMessageAsRead(client: ChatWebSocket, id: number) {
    markMsgAsRead(client, id, this.clientSocketMap, this.chatRooms);
  }
}
