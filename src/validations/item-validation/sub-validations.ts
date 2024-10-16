import { BadRequestException } from '@nestjs/common';
import { TransformFnParams, Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class FilterOptionValidation {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateFilterValidation {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  isMainFilter: boolean;

  @ArrayMinSize(1)
  @ArrayUnique((option) => option.name, {
    message: 'All the option names for the filter must be unique',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => FilterOptionValidation)
  options: FilterOptionValidation[];
}

export const validateDuplicatesNames =
  (key: string, fieldKey: string, errMsg: string) =>
  ({ value, obj }: TransformFnParams): PropertyDecorator => {
    const compareObj = obj?.[key];
    if (compareObj) {
      const createNames =
        compareObj?.reduce((obj, item) => {
          obj[item?.[fieldKey]] = true;
          return obj;
        }, {}) || {};
      const duplicateNames = value.filter(
        (item) => !!createNames[item?.[fieldKey]],
      );
      if (duplicateNames?.length) {
        throw new BadRequestException(errMsg);
      }
    }
    return value;
  };

export const validateMainFilter =
  (key?: string) =>
  ({ value, obj }: TransformFnParams): PropertyDecorator => {
    let count = 0;
    value.forEach((filter) => {
      if (filter.isMainFilter) count += 1;
    });
    const otherFilters = obj?.[key];
    if (otherFilters) {
      otherFilters.forEach((filter) => {
        if (filter.isMainFilter) count += 1;
      });
    }
    const errorMsg =
      count === 0
        ? 'There has to be one main filter'
        : 'There cannot be more than one main filter';
    if (count != 1) {
      throw new BadRequestException(errorMsg);
    }
    return value;
  };

export const validateDeleteIds =
  (key: string, errLabel: string, fieldKey: string = 'id') =>
  ({ value, obj }: TransformFnParams): PropertyDecorator => {
    const compareObj = obj?.[key];
    if (compareObj) {
      const idMap = value.reduce((obj, id) => {
        obj[id] = true;
        return obj;
      }, {});

      compareObj?.forEach?.((item) => {
        const value = item?.[fieldKey];
        if (idMap[value]) {
          throw new BadRequestException(
            `${errLabel} cannot be deleted and updated at the same time`,
          );
        }
      });
    }
    return value;
  };
