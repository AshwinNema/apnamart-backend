import { BadRequestException, NotFoundException } from '@nestjs/common';
import prisma from 'src/prisma/client';

export const validateIncreaseDecreaseCartItemAndGetCart = async (
  userId: number,
  productId: number,
  change?: 1 | -1,
  quantity?: number,
) => {
  const userCart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!userCart) {
    throw new NotFoundException('Cart not found');
  }

  const productCount = userCart.cartItems[productId];
  if (!productCount) {
    throw new NotFoundException('Item is not present in the cart');
  }

  const productDetails = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!productDetails) throw new NotFoundException('Product not found');

  if (change && !(productCount + change)) {
    throw new BadRequestException('Item count cannot be less than 1');
  }

  if (change && productCount + change > productDetails.allowedUnitsPerOrder) {
    throw new BadRequestException(
      `You can order only ${productDetails.allowedUnitsPerOrder} units of the product`,
    );
  }

  if (quantity && quantity > productDetails.allowedUnitsPerOrder) {
    throw new BadRequestException(
      `You can order only ${productDetails.allowedUnitsPerOrder} units of the product`,
    );
  }

  if (change) {
    userCart.cartItems[productId] += change;
  }

  if (quantity) {
    userCart.cartItems[productId] = quantity;
  }

  return userCart;
};
