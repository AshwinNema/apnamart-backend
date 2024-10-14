import { plainToClass, Type } from 'class-transformer';
import {
  validate,
  ValidatorOptions,
  ValidationError,
  Min,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  IsNumber,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { ClassConstructor } from '../utils/types';
import { ValidatedObject } from '../interfaces';
import { processNestedValidationError } from 'src/utils';

export const validateObject = async <T extends object>(
  object: object,
  validatorClass: ClassConstructor<T>,
  options?: ValidatorOptions,
): Promise<ValidatedObject> => {
  const convertedObj: object = plainToClass(validatorClass, object);

  try {
    const errors: ValidationError[] = await validate(convertedObj, options);

    return {
      error: !!errors.length,
      message: processNestedValidationError(errors),
    };
  } catch (err) {
    return {
      error: true,
      message: err.message,
    };
  }
};

export interface paginationOptionsInterface {
  limit: number;
  page: number;
}

export class paginationOptions {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  page: number;

  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit: number;
}

export class SearchByName {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class LatLng {
  @Min(-90)
  @Max(90)
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @Min(-180)
  @Max(180)
  @IsNumber()
  @Type(() => Number)
  longtitude: number;
}

@ValidatorConstraint()
export class CustomDigitLengthValidator
  implements ValidatorConstraintInterface
{
  length: number;
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const length = validationArguments.constraints[0];

    const regExp = new RegExp(`^\\d{${length}}$`);
    return regExp.test(value);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Length should be exactly ${validationArguments.constraints[0]} `;
  }
}
