import { BadRequestException, NotFoundException } from '@nestjs/common';
import prisma from 'src/prisma/client';
import { validateOptionsAndGetFilterQuery } from './option-validation';
import {
  uploadedPhoto,
  databaseDescription,
} from 'src/item-entities/product/interfaces';
import { UserInterface } from 'src/interfaces';

export const validateProductAndGetFilterOptionsQuery = async (
  productId: number,
  user: UserInterface,
  itemId?: number,
  options?: number[],
) => {
  const productDetails = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      filterOptions: true,
    },
  });

  if (!productDetails) {
    throw new NotFoundException('Product not found');
  }

  if (productDetails.merchant != user.id) {
    throw new BadRequestException(
      'Only merchant is allowed to update its own products',
    );
  }

  if (!itemId && !options) return;

  const newItemId = itemId || productDetails.itemId;

  const itemData = await prisma.item.findUnique({
    where: {
      id: newItemId,
      category: {
        archive: false,
      },
    },
    include: {
      filters: {
        where: { archive: false },
        include: {
          options: {
            where: { archive: false },
          },
        },
      },
    },
  });

  if (!itemData) throw new NotFoundException('Item not found');
  return {
    filterQuery: validateOptionsAndGetFilterQuery(
      itemData,
      productDetails,
      options,
      itemId,
    ),
    description: productDetails.description as unknown as databaseDescription,
    photos: productDetails.photos as unknown as uploadedPhoto[],
  };
};
