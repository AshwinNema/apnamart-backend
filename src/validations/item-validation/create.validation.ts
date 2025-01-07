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

import { Transform, Type } from 'class-transformer';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateFilterValidation,
  validateFilterType,
} from './filter-subvalidations';
import { ItemFilterType } from '@prisma/client';
export class CreateItemValidation {
  @ApiPropertyOptional({
    description: 'Image file for the item',
    type: 'string',
    format: 'binary',
    example: 'item-image.jpg',
  })
  @IsOptional()
  @IsFile()
  @MaxFileSize(4e6, {
    message: 'Maximum size of the file should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    message: 'File must be an image',
  })
  file: Express.Multer.File;

  @ApiProperty({
    description:
      'JSON string containing item details including name, category, subcategory and filters',
    example: `{"name":"Mobile","categoryId":1,"subCategoryId":1,"filters":[{"name":"Color","options":[{"name":"Black"},{"name":"White"},{"name":"Blue"}],"filterType":"${ItemFilterType.normal}"},{"name":"Price","options":[{"name":"5000"},{"name":"10000"},{"name":"15000"}],"filterType":"${ItemFilterType.price}"}]}`,
  })
  @IsString()
  @IsNotEmpty()
  data: string;
}
export class CreateItemValidator {
  @ApiProperty({
    description: 'Name of the item',
    example: 'Mobile',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Id of the category this item belongs to',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    description: 'Id of the subcategory this item belongs to',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  subCategoryId: number;

  @ApiProperty({
    description: 'Array of filters associated with the item',
    type: [CreateFilterValidation],
    required: false,
    example: [
      {
        name: 'Color',
        options: [{ name: 'Black' }, { name: 'White' }, { name: 'Blue' }],
        filterType: ItemFilterType.normal,
      },
    ],
  })
  @Transform(validateFilterType())
  @IsOptional()
  @ArrayUnique((option) => option.name, {
    message: 'All filter names should be unique',
  })
  @ValidateNested({ each: true })
  @IsArray()
  @Type(() => CreateFilterValidation)
  filters: CreateFilterValidation[];
}
