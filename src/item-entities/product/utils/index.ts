import { QueryProducts } from 'src/validations';
import * as _ from 'lodash';
import { UserInterface } from 'src/interfaces';
import { Prisma } from '@prisma/client';
import { QueryCustomerProducts } from 'src/validations';

export const queryProductArgs = (
  query: QueryProducts,
  user: UserInterface,
): [
  string,
  {
    limit: number;
    page: number;
  },
  Prisma.ProductFindManyArgs,
] => {
  const paginationOptions = _.pick(query, ['limit', 'page']);
  const where: {
    merchant: number;
    id?: number;
  } = {
    merchant: user.id,
    ..._.pick(query, ['id']),
  };

  return [
    'product',
    paginationOptions,
    {
      where,
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
    },
  ];
};
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
