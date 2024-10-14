import {
  ArgumentMetadata,
  BadRequestException,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { MerchantRegistrationStatus, UserRole } from '@prisma/client';
import prisma from 'src/prisma/client';

export * from './create-registration';

export class ValidateMerchantToBlock implements PipeTransform {
  constructor() {}
  async transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;
    const { type, merchantRegistrationId } = value;
    const id = parseInt(merchantRegistrationId);
    const registrtationDetails = await prisma.merchantDetails.findUnique({
      where: {
        id: id || 0,
      },
      include: {
        user: true,
      },
    });

    if (!registrtationDetails)
      throw new NotFoundException('Merchant registration not found');
    if (!registrtationDetails.user.userRoles.includes(UserRole.merchant))
      throw new BadRequestException('User is not a merchant');
    if (
      registrtationDetails.registrationStatus !==
      MerchantRegistrationStatus.completed
    ) {
      throw new BadRequestException(
        'Merchant registration has not been completed yet',
      );
    }
    const currentState = type === 'block' ? false : true;
    const errorMsg =
      type === 'block'
        ? 'Merchant is already blocked'
        : 'Merchant is already unblocked';
    if (registrtationDetails.isMerchantBlocked != currentState) {
      throw new BadRequestException(errorMsg);
    }
    value.userId = registrtationDetails.userId;
    return value;
  }
}
