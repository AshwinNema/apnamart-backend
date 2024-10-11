import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CommonService, paginationOptions } from 'src/common/common.service';
import prisma from 'src/prisma/client';

@Injectable()
export class ChatService {
  constructor(private commonService: CommonService) {}

  async getOneChatMsg(args: Prisma.ChatFindFirstArgs) {
    return prisma.chat.findFirst(args);
  }

  async getChat(args: Prisma.ChatFindManyArgs) {
    return prisma.chat.findMany(args);
  }

  async queryChats(
    args: Prisma.ChatFindManyArgs,
    paginationOptions: paginationOptions,
  ) {
    return this.commonService.queryData('chat', paginationOptions, args);
  }

  async createChatMsg(data: Prisma.ChatUncheckedCreateInput) {
    return prisma.chat.create({ data });
  }

  async updateChatMsg(
    where: Prisma.ChatWhereUniqueInput,
    data: Prisma.ChatUpdateInput,
  ) {
    return prisma.chat.update({ where, data });
  }
}
