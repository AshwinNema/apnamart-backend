import { QueryItems } from 'src/validations';
import * as _ from 'lodash';

export * from './transformers & validators/create-item.pipe';
export * from './transformers & validators/update-item/update-item-validator.pipe';
export * from './transformers & validators/update-item/update-item-payload-transformer';
export * from './transformers & validators/delete-item.pipe';

export const getQueryItemArgs = (
  query: QueryItems,
): [
  string,
  {
    limit: number;
    page: number;
  },
  {
    [key: string]: any;
    where?: object;
  },
] => {
  const paginationOptions = _.pick(query, ['limit', 'page']);
  const where = _.pick(query, ['id']);
  return [
    'item',
    paginationOptions,
    {
      where,
      include: {
        category: {
          select: {
            name: true,
            id: true,
          },
        },
        subCategory: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    },
  ];
};
