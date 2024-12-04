import * as _ from 'lodash';
import { UserInterface } from 'src/interfaces';
import { Prisma } from '@prisma/client';
import { QueryCustomerProducts } from 'src/validations';

export const queryCustomerProducts = (
  query: QueryCustomerProducts,
  user?: UserInterface,
): [
  string,
  {
    limit: number;
    page: number;
  },
  Prisma.ProductFindManyArgs,
] => {
  const paginationOptions = _.pick(query, ['limit', 'page']);
  const filter = _.pick(query, ['itemId']);
  const productQuery: Prisma.ProductFindManyArgs = {
    where: filter,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      item: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          subCategory: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  };
  if (query.filterOptions) {
    productQuery.where.filterOptions = {
      some: {
        id: { in: query.filterOptions },
      },
    };
  }

  const minMaxPrice: {
    gte?: number;
    lte?: number;
  } = {};

  if (query.minPrice) {
    minMaxPrice.gte = query.minPrice;
  }

  if (query.maxPrice) {
    minMaxPrice.lte = query.maxPrice;
  }

  if (Object.keys(minMaxPrice).length) {
    productQuery.where.price = minMaxPrice;
  }

  if (user) {
    productQuery.include.wishList = {
      where: {
        userId: user.id,
      },
    };
  }

  if (query.subCategoryId) {
    productQuery.where.item = {
      subCategoryId: query.subCategoryId,
    };
  }

  return ['product', paginationOptions, productQuery];
};
