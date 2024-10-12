import { Module } from '@nestjs/common';
import { MerchantAdminChatGateway } from './merchant-admin-chat/merchant-admin-chat.gateway';
import { ChatService } from './chat.service';
import { MerchantRegistration2Service } from 'src/user-entites/merchant/merchant-registration/merchant-registration2.service';
import { MerchantAdminChatHelperService } from './merchant-admin-chat/helpers/helper.service';
import { CommonService } from 'src/common/common.service';
import { MerchantAdminChatService } from './merchant-admin-chat/merchant-admin-chat.service';

@Module({
  providers: [
    MerchantAdminChatGateway,
    MerchantAdminChatService,
    ChatService,
    MerchantRegistration2Service,
    MerchantAdminChatHelperService,
    CommonService,
  ],
  exports: [MerchantAdminChatGateway, ChatService, MerchantAdminChatService],
})
export class ChatModule {}
