import { BadRequestException, Injectable } from '@nestjs/common';
import { MerchantRegistrationStatus, Prisma } from '@prisma/client';
import { CommonService } from 'src/common/common.service';
import prisma from 'src/prisma/client';
import { QueryMerchantRegistrations } from 'src/validations';
import { getQueryRegistrationsArgs } from '../utils';

@Injectable()
export class MerchantRegistration2Service {
  commonService: CommonService;
  constructor() {
    this.commonService = new CommonService();
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
}
