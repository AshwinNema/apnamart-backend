export * from './pipes';
import { MerchantRegistrationStatus } from '@prisma/client';
import * as _ from 'lodash';
import {
  paginationOptionsInterface,
  QueryMerchantRegistrations,
} from 'src/validations';

interface queryRegistrationCondtion {
  where: {
    id?: number;
    name?: {
      contains: string;
      mode: 'insensitive';
    };
    registrationStatus?: MerchantRegistrationStatus;
  };
  include: object;
}

export const getQueryRegistrationsArgs = (
  query: QueryMerchantRegistrations,
): [string, paginationOptionsInterface, queryRegistrationCondtion] => {
  const paginationOptions = _.pick(query, ['limit', 'page']);
  const where: queryRegistrationCondtion['where'] = _.pick(query, [
    'id',
    'registrationStatus',
  ]);
  if (query.name) {
    where.name = {
      contains: query.name,
      mode: 'insensitive',
    };
  }
  return [
    'merchantDetails',
    paginationOptions,
    {
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    },
  ];
};
