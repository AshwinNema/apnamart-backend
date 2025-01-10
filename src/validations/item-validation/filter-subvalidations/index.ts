import { ItemFilterType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { z } from 'zod';
import { ApiProperty } from '@nestjs/swagger';

export * from './transform-validations';

export const priceFilterOptionValidation = z.coerce.number().int().min(1);

export const priceFilterOptionsValidation = z.array(
  priceFilterOptionValidation,
);

export class FilterOptionValidation {
  @ApiProperty({
    description: 'The name of the filter option',
    example: 'Grey',
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateFilterOption extends FilterOptionValidation {
  @ApiProperty({ example: 1, description: 'Id of the filter option' })
  @Min(1)
  @IsInt()
  id: number;
}

export class CreateFilterValidation {
  @ApiProperty({
    description: 'The name of the filter',
    example: 'Color',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The options for the filter',
    type: [FilterOptionValidation],
    example: [{ name: 'Black' }, { name: 'White' }],
  })
  @ArrayMinSize(1)
  @ArrayUnique((option) => option.name, {
    message: 'All the option names for the filter must be unique',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => FilterOptionValidation)
  options: FilterOptionValidation[];

  @ApiProperty({
    description: 'The type of the filter',
    enum: ItemFilterType,
    example: ItemFilterType.normal,
  })
  @IsEnum(ItemFilterType)
  @IsString()
  filterType: ItemFilterType;
}

export class createItemFilterValidation extends CreateFilterValidation {
  @ApiProperty({
    description: 'Id of the item to associate the filter with',
    example: 1,
  })
  @Min(1)
  @IsInt()
  itemId: number;
}
