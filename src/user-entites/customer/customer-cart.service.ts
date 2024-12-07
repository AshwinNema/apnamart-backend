import { Injectable, NotFoundException } from '@nestjs/common';
import { Product2Service } from 'src/item-entities/product/product2.service';
import prisma from 'src/prisma/client';
import { validateIncreaseDecreaseCartItemAndGetCart } from './utils';

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

  async getUserCartItems(userId: number) {
    const userCart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!userCart) return [];
    const productIds = Object.keys(userCart.cartItems).map((productId) =>
      parseInt(productId),
    );
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    });

    return products.map((item) => {
      return {
        details: item,
        count: userCart.cartItems[item.id] || 0,
      };
    });
  }

  async increaseDecreaseItemCount(
    userId: number,
    productId: number,
    change?: 1 | -1,
    quantity?: number,
  ) {
    const userCart = await validateIncreaseDecreaseCartItemAndGetCart(
      userId,
      productId,
      change,
      quantity,
    );

    return prisma.cart.update({
      where: {
        userId: userId,
      },
      data: {
        cartItems: userCart.cartItems,
      },
    });
  }
}
