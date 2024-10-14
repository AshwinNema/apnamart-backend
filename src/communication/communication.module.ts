import { Module } from '@nestjs/common';
import { NotificationService } from './notification/notification.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class CommunicationModule {}
