export * from './pipes';
import { MerchantRegistrationStatus, Prisma, UserRole } from '@prisma/client';
import * as _ from 'lodash';
import {
  paginationOptionsInterface,
  QueryMerchantRegistrations,
  QueryMerchants,
} from 'src/validations';

interface queryRegistrationCondtion {
  where: {
    id?: number;
    name?: {
      contains: string;
      mode: 'insensitive';
    };
    registrationStatus?: MerchantRegistrationStatus;
    isMerchantBlocked?: boolean;
  };
  include: object;
}

export const getQueryRegistrationsArgs = (
  query: QueryMerchantRegistrations,
): [string, paginationOptionsInterface, queryRegistrationCondtion] => {
  const paginationOptions = _.pick(query, ['limit', 'page']);
  const where: queryRegistrationCondtion['where'] = _.pick(query, [
    'isMerchantBlocked',
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
            email: true,
          },
        },
      },
    },
  ];
};

export const getQueryMerchantArgs = (
  query: QueryMerchants,
): [string, paginationOptionsInterface, Prisma.UserFindManyArgs] => {
  const paginationOptions = _.pick(query, ['limit', 'page']);
  const where: Prisma.UserWhereInput = _.pick(query, ['id', 'merchantDetails']);
  if (query.name) {
    where.name = {
      contains: query.name,
      mode: 'insensitive',
    };
  }
  where.userRoles = {
    hasEvery: [UserRole.merchant],
  };
  return [
    'user',
    paginationOptions,
    {
      where,
      include: {
        merchantDetails: true,
      },
    },
  ];
};
