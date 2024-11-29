import { ItemFilterType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

import { z } from 'zod';

export * from './transform-validations';

export const priceFilterOptionValidation = z.coerce.number().int().min(1);

export const priceFilterOptionsValidation = z.array(
  priceFilterOptionValidation,
);

export class FilterOptionValidation {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreateFilterValidation {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ArrayMinSize(1)
  @ArrayUnique((option) => option.name, {
    message: 'All the option names for the filter must be unique',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => FilterOptionValidation)
  options: FilterOptionValidation[];

  @IsEnum(ItemFilterType)
  @IsString()
  filterType: ItemFilterType;
}
