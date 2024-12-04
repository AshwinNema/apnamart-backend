import { Injectable } from '@nestjs/common';
import prisma from 'src/prisma/client';

@Injectable()
export class CustomerService {
  async getCategorySubCategoryItemMenu() {
    return prisma.category.findMany({
      select: {
        id: true,
        name: true,
        photo: true,
        subCategory: {
          select: {
            id: true,
            name: true,
            items: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async addRemoveItemInUserWishlist(
    userId: number,
    productId: number,
    connect: boolean,
  ) {
    const createWislistQuery: {
      userId: number;
      products?: {
        connect: { id: number };
      };
    } = { userId };
    if (connect) {
      createWislistQuery.products = { connect: { id: productId } };
    }
    return prisma.wishList.upsert({
      where: { userId },
      update: {
        products: {
          [connect ? 'connect' : 'disconnect']: {
            id: productId,
          },
        },
      },
      create: createWislistQuery,
    });
  }
}
