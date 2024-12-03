import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';

export * from './query-products';
export * from './subvalidations';

export class UpdateProductValidation {
  @IsString()
  @IsNotEmpty()
  data: string;

  @IsFiles()
  @MaxFileSize(0.5e6, {
    each: true,
    message: 'Maximum size of the description should be 0.5 mega byte',
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
  @MaxFileSize(0.5e6, {
    each: true,
    message: 'Maximum size of the product image should be 0.5 mega byte',
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
