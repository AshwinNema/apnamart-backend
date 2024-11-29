import { Injectable, NotFoundException } from '@nestjs/common';
import { Product2Service } from 'src/item-entities/product/product2.service';
import prisma from 'src/prisma/client';

@Injectable()
export class CustomerService {
  constructor(private productService: Product2Service) {}
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

  async addRemoveCartItem(
    userId: number,
    productId: number,
    connect: boolean,
    quanity?: number,
  ) {
    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Product Not found');
    }
    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });
    let cartItems = (userCart?.cartItems || {}) as {
      [key: string]: number;
    };
    if (!connect) {
      delete cartItems[productId];
    }
    if (connect) {
      cartItems[productId] = quanity;
    }
    const createCartQuery: {
      userId: number;
      cartItems: object;
    } = { userId, cartItems };

    return prisma.cart.upsert({
      where: { userId },
      update: {
        cartItems,
      },
      create: createCartQuery,
    });
  }
}
