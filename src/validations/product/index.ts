import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { paginationOptions } from '../common.validation';
import { Type } from 'class-transformer';

export * from './subvalidations';

export class UpdateProductValidation {
  @IsString()
  @IsNotEmpty()
  data: string;

  @IsFiles()
  @MaxFileSize(4e6, {
    each: true,
    message: 'Maximum size of the description should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    each: true,
    message: 'All the product image files must be of image format',
  })
  @IsOptional()
  productImages: Express.Multer.File[];

  @IsFiles()
  @MaxFileSize(4e6, {
    each: true,
    message: 'Maximum size of the description should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    each: true,
    message: 'All the description files must be of image format',
  })
  @IsOptional()
  newDescriptionFiles: Express.Multer.File[];

  @IsFiles()
  @MaxFileSize(4e6, {
    each: true,
    message: 'Maximum size of the description file should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    each: true,
    message: 'All the description files must be of image format',
  })
  @IsOptional()
  updatedDescriptionFiles: Express.Multer.File[];
}

export class CreateProductValidation {
  @IsString()
  @IsNotEmpty()
  data: string;

  @IsFiles()
  @MaxFileSize(4e6, {
    each: true,
    message: 'Maximum size of the description should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    each: true,
    message: 'All the product image files must be of image format',
  })
  productImages: Express.Multer.File[];

  @IsFiles()
  @MaxFileSize(4e6, {
    each: true,
    message: 'Maximum size of the description should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    each: true,
    message: 'All the description files must be of image format',
  })
  @IsOptional()
  descriptionFiles: Express.Multer.File[];
}

export class QueryProducts extends paginationOptions {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

export class QueryCustomerProducts extends paginationOptions {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  itemId: number;

  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  subCategoryId: number;
}
