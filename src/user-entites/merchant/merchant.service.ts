import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { paginationOptions, QueryMerchants } from 'src/validations';
import { getQueryMerchantArgs } from './utils';

@Injectable()
export class MerchantService {
  constructor(private commonService: CommonService) {}

  async queryMerchants(query: QueryMerchants) {
    return this.commonService.queryData(...getQueryMerchantArgs(query));
  }

  async queryMerchantOrders(
    merchantId: number,
    paginationOptions: paginationOptions,
  ) {
    return this.commonService.queryData('orderItem', paginationOptions, {
      where: {
        product: {
          merchant: merchantId,
        },
      },
      include: {
        order: {
          select: {
            id: true,
            paymentMode: true,
            paymentStatus: true,
          },
        },
        product: {
          select: {
            name: true,
            photos: true,
          },
        },
      },
    });
  }
}
