import { Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import prisma from 'src/prisma/client';
import { queryCustomerProducts } from './utils';
import { QueryCustomerProducts } from 'src/validations';
import { UserInterface } from 'src/interfaces';
import { Prisma } from '@prisma/client';

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

  async getProductById(id: number, user?: UserInterface) {
    const query: Prisma.ProductFindUniqueArgs = {
      where: { id },
    };
    let cartQuantity = 0;
    if (user) {
      const userCart = await prisma.cart.findUnique({
        where: { userId: user.id },
      });
      cartQuantity = userCart?.cartItems?.[id] || 0;
      query.include = {
        wishList: {
          where: {
            userId: user.id,
          },
        },
      };
    }
    const data = await prisma.product.findUnique(query);
    return {
      ...data,
      cartQuantity,
    };
  }
}
