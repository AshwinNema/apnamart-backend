import { QueryProducts } from 'src/validations';
import * as _ from 'lodash';
import { UserInterface } from 'src/interfaces';

export const queryProductArgs = (
  query: QueryProducts,
  user: UserInterface,
): [
  string,
  {
    limit: number;
    page: number;
  },
  object,
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
            category: true,
          },
        },
      },
    },
  ];
};
