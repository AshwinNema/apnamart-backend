import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import prisma from 'src/prisma/client';

@Injectable()
export class NotificationService {
  async createNotification(data: Prisma.NotificationCreateInput) {
    return prisma.notification.create({ data });
  }
  async getAllNotifications() {}
}
