import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  FilterOptionValidation,
  UpdateFilterOption,
  validateDeleteIds,
  validateDuplicatesNames,
} from '../filter-subvalidations';
import { ItemFilterType } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class updateFilter {
  @ApiProperty({
    example: 1,
    description: 'Id of the filter',
  })
  @Min(1)
  @IsInt()
  id: number;

  @ApiPropertyOptional({
    example: 'RAM',
    description: 'The name of the filter',
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    type: [FilterOptionValidation],
    example: [{ name: '1 GB' }, { name: '5 GB' }],
    description: 'The options to be created for the filter',
  })
  @IsOptional()
  @ArrayUnique((option) => option.name, {
    message: 'All the option names for the filter must be unique',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => FilterOptionValidation)
  createOptions: FilterOptionValidation[];

  @ApiPropertyOptional({
    type: [Number],
    example: [1, 2, 3],
    description: 'The ids of the options to be deleted',
  })
  @Transform(validateDeleteIds('updateOptions', 'Filter options'))
  @IsInt({ each: true })
  @IsArray()
  @ArrayUnique((id) => id)
  @IsOptional()
  deleteOptions: number[];

  @ApiPropertyOptional({
    enum: ItemFilterType,
    example: ItemFilterType.normal,
    description: 'The type of the filter',
  })
  @IsOptional()
  @IsEnum(ItemFilterType)
  @IsString()
  filterType: ItemFilterType;

  @ApiPropertyOptional({
    type: [UpdateFilterOption],
    example: [
      { id: 1, name: '2 GB' },
      { id: 2, name: '5 GB' },
    ],
    description: 'The options to be updated for the filter',
  })
  @Transform(
    validateDuplicatesNames(
      'createOptions',
      'name',
      'Same name present while creating and updating options',
    ),
  )
  @ArrayUnique((option) => option.name, {
    message: 'All the option names for the filter must be unique',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => UpdateFilterOption)
  @IsOptional()
  updateOptions: UpdateFilterOption[];
}
