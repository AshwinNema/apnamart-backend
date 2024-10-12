import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { UseFilters, UsePipes } from '@nestjs/common';
import {
  SocketAuthValidationPipe,
  WebsocketExceptionFilter,
} from '../../socket';
import { UserRole } from '@prisma/client';
import {
  ValidateAndTransformInitialMerchanAdminChat,
  WsClassValidator,
} from '../validation-pipes';
import { ChatWebSocket } from 'src/utils/types';
import { adminMerchantChat, merchantAdminChatEvents } from '../utils';
import { queryAdminMerchantChatMsgs } from 'src/validations';
import { MerchantAdminChatHelperService } from './helpers/helper.service';

@WebSocketGateway({
  path: 'chat',
})
export class MerchantAdminChatGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private helperService: MerchantAdminChatHelperService) {}

  handleConnection(client: ChatWebSocket) {
    this.helperService.handleConnection(client);
  }

  handleDisconnect(client: ChatWebSocket) {
    this.helperService.handleDisconnect(client);
  }

  @UsePipes(new ValidateAndTransformInitialMerchanAdminChat('initiate'))
  @UsePipes(
    new SocketAuthValidationPipe([UserRole.admin, UserRole.merchant], {
      includeMerchantDetails: true,
    }),
  )
  @UseFilters(
    new WebsocketExceptionFilter(merchantAdminChatEvents.initiateChat),
  )
  @SubscribeMessage(merchantAdminChatEvents.initiateChat)
  async initiateChat(
    @ConnectedSocket() client: ChatWebSocket,
    @MessageBody()
    data: adminMerchantChat['handleSocketConnection'],
  ) {
    return this.helperService.initiateChat(client, data);
  }

  @UsePipes(new ValidateAndTransformInitialMerchanAdminChat('reinitiate'))
  @UsePipes(
    new SocketAuthValidationPipe([UserRole.admin, UserRole.merchant], {
      includeMerchantDetails: true,
    }),
  )
  @UseFilters(
    new WebsocketExceptionFilter(
      merchantAdminChatEvents.reinitiateMerchantAdminChat,
    ),
  )
  @SubscribeMessage(merchantAdminChatEvents.reinitiateMerchantAdminChat)
  async reinitiateMerchantAdminChat(
    @ConnectedSocket() client: ChatWebSocket,
    @MessageBody()
    data: adminMerchantChat['handleSocketConnection'],
  ) {
    return this.helperService.initiateChat(client, data);
  }

  @UseFilters(new WebsocketExceptionFilter(merchantAdminChatEvents.sendChatMsg))
  @SubscribeMessage(merchantAdminChatEvents.sendChatMsg)
  async sendChatMsg(
    @ConnectedSocket() client: ChatWebSocket,
    @MessageBody()
    message: string,
  ) {
    return this.helperService.sendChatMsg(client, message);
  }

  @UsePipes(new WsClassValidator(queryAdminMerchantChatMsgs))
  @UseFilters(
    new WebsocketExceptionFilter(merchantAdminChatEvents.queryChatsMsgs),
  )
  @SubscribeMessage(merchantAdminChatEvents.queryChatsMsgs)
  queryChatMsgs(
    @ConnectedSocket() client: ChatWebSocket,
    @MessageBody()
    details: queryAdminMerchantChatMsgs,
  ) {
    return this.helperService.queryChatMessages(client, details);
  }

  @UseFilters(
    new WebsocketExceptionFilter(merchantAdminChatEvents.markMsgAsRead),
  )
  @SubscribeMessage(merchantAdminChatEvents.markMsgAsRead)
  markMessageAsRead(
    @ConnectedSocket() client: ChatWebSocket,
    @MessageBody() id: number,
  ) {
    this.helperService.markMessageAsRead(client, id);
  }
}
