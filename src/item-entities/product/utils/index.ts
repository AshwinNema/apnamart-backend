import { QueryProducts } from 'src/validations';
import * as _ from 'lodash';
import { UserInterface } from 'src/interfaces';
import { Prisma } from '@prisma/client';

export * from './query-customer-products';

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

  const q1: Prisma.ProductFindManyArgs = {
    where: {
      filterOptions: {
        every: {},
      },
    },
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
