import { ChatMsgStatus, ChatType, Prisma } from '@prisma/client';
import {
  adminMerchantChatClientDetails,
  getAdminMerchantChatUnreadMsgFilter,
} from 'src/communication/chat/utils';
import prisma from 'src/prisma/client';
import { checkUserIsReceiver } from '../../..';

export const transactionQuery = async (
  id: number,
  clientDetails: adminMerchantChatClientDetails,
  readTime: Date,
  throwErr: (msg: string) => void,
) => {
  const maxRetries = 5;
  let retries = 0,
    allDetails;

  while (retries < maxRetries) {
    try {
      const updatedDetails = await prisma.$transaction(
        async function (transaction) {
          const chatData = await transaction.chat.findFirst({
            where: {
              id,
              entityModelId: clientDetails.merchantRegistrationId,
              chatType: ChatType.merchant_registration,
            },
          });

          if (!chatData) throwErr('Chat message not found');

          if (chatData.status === ChatMsgStatus.read)
            throwErr('Message is already read');

          const isUserReceiver = checkUserIsReceiver(
            clientDetails.userId,
            clientDetails,
            chatData.receiverId,
          );
          if (!isUserReceiver)
            throwErr('User is not the receiver of the message');

          const updatedMsg = await transaction.chat.update({
            where: { id },
            data: {
              status: ChatMsgStatus.read,
              readTime,
            },
          });
          const unreadMsgFilter = getAdminMerchantChatUnreadMsgFilter(
            clientDetails.merchantId,
            clientDetails.isClientMerchant,
          );
          const unreadMsgCount = await transaction.chat.count({
            where: {
              ...unreadMsgFilter,
              chatType: ChatType.merchant_registration,
              entityModelId: clientDetails.merchantRegistrationId,
            },
          });

          return { updatedMsg, unreadMsgCount };
        },
        {
          maxWait: 5000,
          timeout: 10000,
          isolationLevel: Prisma.TransactionIsolationLevel.ReadUncommitted,
        },
      );
      allDetails = updatedDetails;
      break;
    } catch (error) {
      if (error.code === 'P2034') {
        retries++;
        continue;
      }
      throwErr(error.message);
    }
  }

  if (!allDetails) {
    throwErr('Connection timed out');
  }

  return allDetails;
};
