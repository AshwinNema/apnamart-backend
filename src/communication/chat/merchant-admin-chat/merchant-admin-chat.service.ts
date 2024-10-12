import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginationOptions } from 'src/common/common.service';
import { ChatWebSocket } from 'src/utils/types';
import {
  adminMerchantChat,
  getAdminMerchantChatUnreadMsgFilter,
} from '../utils';
import prisma from 'src/prisma/client';
import { getPaginationOptions } from 'src/utils';
import { markMsgsAsDeliveredAndGetUpdatedList } from './helpers';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class MerchantAdminChatService {
  async queryAdminMerchantChat(
    args: Prisma.ChatFindManyArgs,
    { page, limit }: paginationOptions,
    client: ChatWebSocket,
    clientSocketMap: adminMerchantChat['clientSocketMap'],
    chatRooms: adminMerchantChat['chatRooms'],
    deliveryTime: Date,
  ) {
    const clientId = client.id;
    const clientDetails = clientSocketMap[clientId];
    const merchantId = clientDetails.merchantId;
    const unreadMsgCountFilter = getAdminMerchantChatUnreadMsgFilter(
      merchantId,
      clientDetails.isClientMerchant,
    );
    const maxRetries = 5;
    let retries = 0;
    let results, totalResults, unreadMsgCount;

    while (retries < maxRetries) {
      try {
        const allDetails = await prisma.$transaction(
          async function (transaction) {
            const results = await transaction.chat.findMany({
              ...getPaginationOptions(page, limit),
              orderBy: {
                createdAt: 'desc',
              },
              ...args,
            });

            const totalResults = await transaction.chat.count({
              where: args.where || {},
            });

            const unreadMsgCount = await transaction.chat.count({
              where: { ...args.where, ...unreadMsgCountFilter },
            });

            const newResultList = await markMsgsAsDeliveredAndGetUpdatedList(
              results,
              clientDetails,
              transaction,
              chatRooms,
              clientSocketMap,
              deliveryTime,
            );

            return {
              results: newResultList,
              totalResults,
              unreadMsgCount,
            };
          },
          {
            maxWait: 5000,
            timeout: 10000,
            isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
          },
        );
        results = allDetails.results;
        totalResults = allDetails.totalResults;
        unreadMsgCount = allDetails.unreadMsgCount;
        break;
      } catch (error) {
        if (error.code === 'P2034') {
          retries++;
          continue;
        }
        throw new WsException(error.message);
      }
    }
    if (!results) {
      throw new WsException('Connection timed out');
    }
    return {
      results,
      totalResults,
      page,
      limit,
      totalPages: Math.ceil(totalResults / limit),
      unreadMsgCount,
    };
  }
}
