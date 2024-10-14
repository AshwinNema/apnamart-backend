import { BadRequestException, Injectable } from '@nestjs/common';
import { MerchantRegistrationStatus, Prisma } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import prisma from 'src/prisma/client';
import {
  blockUnblockMerchant,
  blockUnblockMerchantType,
  QueryMerchantRegistrations,
} from 'src/validations';
import { getQueryRegistrationsArgs } from '../utils';
import { ProductService } from 'src/item-entities/product/product.service';

@Injectable()
export class MerchantRegistration2Service {
  commonService: CommonService;
  productService: ProductService;
  constructor() {
    this.commonService = new CommonService();
    this.productService = new ProductService()
  }

  async getOneMerchantRegistration(args: Prisma.MerchantDetailsFindFirstArgs) {
    return prisma.merchantDetails.findFirst(args);
  }

  async queryRegistrations(query: QueryMerchantRegistrations) {
    return this.commonService.queryData(...getQueryRegistrationsArgs(query));
  }

  async approveMerchantRegistration(id: number) {
    const updatedRegistration = await prisma.merchantDetails.update({
      where: {
        id,
        registrationStatus: MerchantRegistrationStatus.review_by_admin,
      },
      data: {
        registrationStatus: MerchantRegistrationStatus.completed,
      },
    });
    if (!updatedRegistration) {
      throw new BadRequestException(
        'The registration to be approved is either not present in the system or has already seen approved before. Please check',
      );
    }

    return updatedRegistration;
  }

  async banremoveBanMerchat(body: blockUnblockMerchant) {
    await this.productService.updateManyProducts({
      where: { merchant: body.userId },
      data: { isBlocked: body.type === blockUnblockMerchantType.block },
    });
    return prisma.merchantDetails.update({
      where: { id: body.merchantRegistrationId },
      data: {
        isMerchantBlocked: body.type === blockUnblockMerchantType.block,
      },
    });
  }
}
