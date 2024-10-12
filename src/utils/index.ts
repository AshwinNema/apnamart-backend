import { UserRole } from '@prisma/client';
import { AxiosRequestConfig } from 'axios';
import { ValidationError } from 'class-validator';

export const getTokenExpiration = (expirationSec: number): Date => {
  const expirationDate = new Date();
  expirationDate.setSeconds(expirationDate.getSeconds() + expirationSec);
  return expirationDate;
};

export const passwordValidation = {
  regex: /(?=.*[A-Z])(?=.*\d).{8,}|(?=.*\d)(?=.*[A-Z]).{8,}/,
  message:
    'password should contain 1 capital letter, 1 number and should have a length of atleast 8 characters',
};

export const mimeTypes = {
  image: 'image/*',
  video: 'video/*',
  imageOrVideo: ['image/*', 'video/*'],
};

export enum axiosMethods {
  get = 'GET',
  put = 'PUT',
  post = 'POST',
  delete = 'DELETE',
}
export interface params {
  [key: string]: number | string | boolean;
}

export type NonAdminRoles = Exclude<UserRole, 'admin'>;

export enum NonAdminRoleEnum {
  merchant = 'merchant',
  customer = 'customer',
}

export enum OtherTokenTypes {
  twitter = 'twitter',
}

export const processNestedValidationError = (errors: ValidationError[]) => {
  return errors
    .map((error: ValidationError) => {
      if (error.constraints) {
        return Object.values(error.constraints).join(', ');
      }
      if (error.children) {
        return processNestedValidationError(error.children);
      }
      return '';
    })
    .join(', ');
};

export const makeAxiosConfig = (
  method: axiosMethods,
  url: string,
  params?: params,
  data?: object,
  headers: object = {},
): AxiosRequestConfig => {
  if (params) {
    const query = Object.keys(params)
      .map(
        (k: string) =>
          encodeURIComponent(k) + '=' + encodeURIComponent(params[k]),
      )
      .join('&');
    url += `?${query}`;
  }
  const config: AxiosRequestConfig = { method, url, headers };
  if (data) {
    config.data = data;
  }

  return config;
};

export const getPaginationOptions = (page?: number, limit?: number) => {
  const options: {
    take?: number;
    skip?: number;
  } = {};
  if (limit) options.take = limit;
  if (limit && page) options.skip = (page - 1) * limit;
  return options;
};
