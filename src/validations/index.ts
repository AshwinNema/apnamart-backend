import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export * from './auth';
export * from './category.validation';
export * from './common.validation';
export * from './product.validation';
export * from './user.validation';
export * from './delivery-location.validation';
export * from './item-validation';
export * from './subcategory.validation';
export * from './merchant-validations';
export * from './communication';

export function IsNull(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNull',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return value === null; // Check if the value is null
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be null`; // Default error message
        },
      },
    });
  };
}
