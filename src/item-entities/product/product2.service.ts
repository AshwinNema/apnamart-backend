import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import prisma from 'src/prisma/client';
import { queryCustomerProducts } from './utils';
import { QueryCustomerProducts } from 'src/validations';
import { UserInterface } from 'src/interfaces';

@Injectable()
export class Product2Service {
  constructor(private commonService: CommonService) {}

  async queryCustomerProducts(
    query: QueryCustomerProducts,
    user?: UserInterface,
  ) {
    let entityData = null;

    if (query.itemId) {
      entityData = await prisma.item.findUnique({
        where: { id: query.itemId },
        select: {
          id: true,
          name: true,
        },
      });
    }

    if (query.subCategoryId) {
      entityData = await prisma.subCategory.findUnique({
        where: { id: query.subCategoryId },
        select: {
          id: true,
          name: true,
        },
      });
    }

    return {
      data: await this.commonService.queryData(
        ...queryCustomerProducts(query, user),
      ),
      entityData,
    };
  }
}
