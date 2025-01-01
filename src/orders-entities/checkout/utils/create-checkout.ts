import { BadRequestException } from '@nestjs/common';
import { UserInterface } from 'src/interfaces';
import prisma from 'src/prisma/client';
import { CheckoutItem } from 'src/validations';

const getProductMap = async (productIds: number[]) => {
  const productList = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  if (productList.length != productIds.length) {
    throw new BadRequestException('Products not found');
  }
  return productList.reduce((productMap, product) => {
    productMap[product.id] = product;
    return productMap;
  }, {});
};

export const validateCheckoutItems = async (cartItems: CheckoutItem[]) => {
  const productIds = cartItems.map((item) => item.productId);
  const productMap = await getProductMap(productIds);

  cartItems.forEach((cartItem) => {
    const productDetails = productMap[cartItem.productId];
    const allowedQuantity = productDetails.allowedUnitsPerOrder;
    if (cartItem.quantity > allowedQuantity) {
      throw new BadRequestException(
        `You cannot order more than ${allowedQuantity} units for ${productDetails.name}`,
      );
    }
  });

  return cartItems.reduce(
    ({ checkoutItems, itemDetails }, cartItem) => {
      const productDetails = productMap[cartItem.productId];
      const cartItemDetails = {
        ...cartItem,
        price: productDetails.price as number,
        name: productDetails.name as string,
      };
      checkoutItems.push(cartItemDetails);
      itemDetails.push({
        ...cartItemDetails,
        photos: productDetails.photos,
        allowedUnitsPerOrder: productDetails.allowedUnitsPerOrder,
      });
      return { checkoutItems, itemDetails };
    },
    {
      checkoutItems: [],
      itemDetails: [],
    },
  );
};

export const getCheckoutCartItems = async (user: UserInterface) => {
  const userCart = await prisma.cart.findUnique({
    where: {
      userId: user.id,
    },
  });
  const cartItems = Object.keys(userCart?.cartItems || {});
  if (!cartItems.length) {
    throw new BadRequestException('There are no items in the cart');
  }
  const productIds = cartItems.map((productId) => parseInt(productId));
  const productMap = await getProductMap(productIds);
  return productIds.reduce(
    ({ checkoutItems, itemDetails }, productId) => {
      const productDetails = productMap[productId];
      const cartItemDetails = {
        quantity: userCart?.cartItems[productId] as number,
        name: productDetails.name,
        productId,
        price: productDetails.price,
      };
      checkoutItems.push(cartItemDetails);
      itemDetails.push({
        ...cartItemDetails,
        photos: productDetails.photos,
        allowedUnitsPerOrder: productDetails.allowedUnitsPerOrder,
      });
      return { checkoutItems, itemDetails };
    },
    {
      checkoutItems: [],
      itemDetails: [],
    },
  );
};
