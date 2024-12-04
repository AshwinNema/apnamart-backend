import { Injectable, NotFoundException } from '@nestjs/common';
import { Product2Service } from 'src/item-entities/product/product2.service';
import prisma from 'src/prisma/client';

@Injectable()
export class CustomerCartService {
  constructor(private productService: Product2Service) {}

  async addRemoveCartItem(userId: number, productId: number, connect: boolean) {
    const product = await this.productService.getProductById(productId);
    if (!product) {
      throw new NotFoundException('Product Not found');
    }
    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });
    const cartItems = (userCart?.cartItems || {}) as {
      [key: string]: number;
    };
    if (!connect) {
      delete cartItems[productId];
    }
    if (connect && !cartItems[productId]) {
      cartItems[productId] = 1;
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

  async getUserCartCount(userId: number) {
    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) return 0;

    return Object.keys(userCart.cartItems).length;
  }
}
