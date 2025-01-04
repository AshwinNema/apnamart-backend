import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import prisma from 'src/prisma/client';
import { paginationOptions } from 'src/validations';

@Injectable()
export class CustomerOrderService {
  constructor(private commonService: CommonService) {}

  async queryCustomerOrders(customerId: number, query: paginationOptions) {
    return this.commonService.queryData('order', query, {
      where: {
        customerId,
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                photos: true,
              },
            },
          },
        },
      },
      omit: null,
    });
  }
}
