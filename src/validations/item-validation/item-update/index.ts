import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { updateFilter } from './sub-validations';
import {
  validateDuplicatesNames,
  CreateFilterValidation,
  validateDeleteIds,
  validateFilterType,
} from '../filter-subvalidations';
import { ApiProperty } from '@nestjs/swagger';
import { newFiltersDefinition, updateFiltersDefinition } from './swagger-definitions';

export class UpdateItem {
  @ApiProperty({
    description: 'Name of the item',
    example: 'Mobile',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Id of the category',
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  categoryId: number;

  @ApiProperty({
    description: 'Id of the sub category',
    example: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  subCategoryId: number;

  @ApiProperty(newFiltersDefinition)
  @ArrayUnique((option) => option.name, {
    message: 'All new filter names should be unique',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateFilterValidation)
  @IsOptional()
  newFilters: CreateFilterValidation[];

  @ApiProperty({
    description: 'Ids of filters to be deleted',
    type: [Number],
    example: [1, 2, 3],
    required: false,
  })
  @Transform(validateDeleteIds('updateFilters', 'Filters'))
  @IsInt({ each: true })
  @IsArray()
  @ArrayUnique((id) => id)
  @IsOptional()
  deleteFilters: number[];

  @ApiProperty(updateFiltersDefinition)
  @Transform(validateFilterType('newFilters', true))
  @Transform(
    validateDuplicatesNames(
      'newFilters',
      'name',
      'Same names present while creating and updating filters',
    ),
  )
  @ArrayUnique((option) => option.id, {
    message: 'All filter ids should be unique',
  })
  @ArrayUnique((option) => option.name, {
    message: 'All update filter names should be unique',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => updateFilter)
  @IsOptional()
  updateFilters: updateFilter[];
}
