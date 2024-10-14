import { BadRequestException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { UserInterface } from 'src/interfaces';
import { authAccessType } from 'src/validations';

// 1. In non sign up flow user creation is not allowed
// 2. In non sign up flow a user cannot be assigned a new role
// 3. Admin creation is not alllowed in the system
// 4. Admin role cannot be assigned to any user in the system

export const otherAuthChecks = (
  accessType: authAccessType,
  userDetails: UserInterface | null,
  role: UserRole,
  returnErr?: boolean,
) => {
  if (accessType !== authAccessType.signUp && !userDetails) {
    if (returnErr) return 'User can only be created in sign up flow';
    throw new BadRequestException('User can only be created in sign up flow');
  }

  if (
    accessType !== authAccessType.signUp &&
    !userDetails.userRoles.includes(role)
  ) {
    if (returnErr)
      return 'User can cannot be assigned new role in the login flow';
    throw new BadRequestException(
      'User can cannot be assigned new role in the login flow',
    );
  }
  if (role === UserRole.admin && !userDetails) {
    if (returnErr) return 'Admin user creation not allowed';
    throw new BadRequestException('Admin user creation not allowed');
  }
  if (
    role === UserRole.admin &&
    userDetails &&
    !userDetails.userRoles.includes(UserRole.admin)
  ) {
    if (returnErr) return 'Admin role cannot be assigned to existing user';
    throw new BadRequestException(
      'Admin role cannot be assigned to existing user',
    );
  }
};

export const parseTwitterTokenResponse = (body: string) => {
  const keyValuePairs = body.split('&');
  const parsedData = {};
  keyValuePairs.forEach((pair) => {
    const [key, value] = pair.split('=');
    parsedData[key] = decodeURIComponent(value);
  });
  return parsedData;
};

export interface twitterAccessTokenResponse {
  oauth_token: string;
  oauth_token_secret: string;
  user_id: string;
}

export interface twitterRequestTokenResponse {
  oauth_callback_confirmed: string;
  oauth_token: string;
  oauth_token_secret: string;
}

export const getLoginOptions = (role: UserRole) => {
  const defaultOptions = { omit: { password: false } };
  switch (role) {
    case UserRole.merchant:
      return {
        include: {
          merchantDetails: true,
        },
        ...defaultOptions,
      };
    default:
      return defaultOptions;
  }
};
