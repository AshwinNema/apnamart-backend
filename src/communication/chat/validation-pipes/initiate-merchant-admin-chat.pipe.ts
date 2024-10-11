import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ChatType, Prisma, UserRole } from '@prisma/client';
import * as _ from 'lodash';
import { MerchantRegistration2Service } from 'src/user-entites/merchant/merchant-registration/merchant-registration2.service';
import {
  initialAdminMerchantChat,
  reinitiateMerchantAdminChat,
  validateObject,
} from 'src/validations';

@Injectable()
export class ValidateAndTransformInitialMerchanAdminChat
  implements PipeTransform
{
  merchantRegistrationService: MerchantRegistration2Service;

  constructor(private chatType: 'initiate' | 'reinitiate') {
    this.merchantRegistrationService = new MerchantRegistration2Service();
  }

  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;
    const options = _.pick(value, [
      `${this.chatType === 'reinitiate' ? 'cursor' : 'limit'}`,
      'merchantRegistrationId',
      'role',
    ]);

    const { error, message } =
      this.chatType === 'reinitiate'
        ? await validateObject(options, reinitiateMerchantAdminChat, {
            whitelist: true,
            forbidNonWhitelisted: true,
          })
        : await validateObject(options, initialAdminMerchantChat, {
            whitelist: true,
            forbidNonWhitelisted: true,
          });

    if (error) throw new WsException(message);
    const isMerchantRole = options?.role === UserRole.merchant;
    const merchantRegistrationId = isMerchantRole
      ? value?.user?.merchantDetails?.id
      : options.merchantRegistrationId;
    if (!merchantRegistrationId)
      throw new WsException('Merchant Registration not found');
    let merchantId = isMerchantRole ? value?.user?.id : null;

    if (!isMerchantRole) {
      const registrationDetails =
        await this.merchantRegistrationService.getOneMerchantRegistration({
          where: { id: merchantRegistrationId },
        });

      if (!registrationDetails)
        throw new WsException('Merchant registration not found');

      merchantId = registrationDetails.userId;
    }

    const reinitiateQueryOptions: Prisma.ChatFindManyArgs =
      this.chatType === 'reinitiate'
        ? {
            skip: 1,
            cursor: {
              id: options.cursor,
            },
          }
        : {};
    const chatQuery: Prisma.ChatFindManyArgs = {
      where: {
        chatType: ChatType.merchant_registration,
        entityModelId: merchantRegistrationId,
      },
      orderBy: {
        sentTime: 'desc',
      },
      ...reinitiateQueryOptions,
    };

    const paginationOptions =
      this.chatType === 'reinitiate'
        ? {}
        : {
            paginationOptions: {
              limit: options.limit,
            },
          };

    return {
      chatQuery,
      user: value.user,
      merchantRegistrationId,
      role: value.role,
      ...paginationOptions,
      merchantId,
    };
  }
}
