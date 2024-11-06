import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { z } from 'zod';

export function IsNull(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return value === null; // Check if the value is null
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be null`; // Default error message
        },
      },
    });
  };
}

export const requiredStringValidation = (keyName: string) => {
  return z
    .string()
    .transform((val) => val.trim())
    .refine((val) => !!val.length, {
      message: `${keyName} is required`,
    });
};

export * from './auth';
export * from './category.validation';
export * from './subcategory.validation';
export * from './common.validation';
export * from './product';
export * from './user.validation';
export * from './delivery-location.validation';
export * from './item-validation';
export * from './merchant-validations';
export * from './communication';
