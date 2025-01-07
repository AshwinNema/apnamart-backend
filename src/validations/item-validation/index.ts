import { IsInt, IsOptional, Min } from 'class-validator';
import { paginationOptions } from '../common.validation';
import { Type } from 'class-transformer';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export * from './item-update';
export * from './create.validation';

export class QueryItems extends paginationOptions {
  @ApiPropertyOptional({
    description: 'Id of the item',
    example: 1,
  })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

export class ItemFileUpload {
  @ApiProperty({
    description: 'Image file to be uploaded',
    type: 'string',
    format: 'binary',
    example: 'image.jpg',
  })
  @IsFile()
  @MaxFileSize(4e6, {
    message: 'Maximum size of the file should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    message: 'File must be an image',
  })
  file: Express.Multer.File;
}

export class getItemListValidation {
  @ApiProperty({
    description: 'Filter items by category id',
    required: false,
    example: 1,
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({
    description: 'Filter items by subcategory id',
    required: false,
    example: 1,
  })
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  subCategoryId: number;
}
