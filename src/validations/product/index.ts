import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { ApiProperty } from '@nestjs/swagger';
import { multiFileApiDefinition } from '..';

export * from './query-products';
export * from './subvalidations';

export class UpdateProductValidation {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty(multiFileApiDefinition())
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

  @ApiProperty(multiFileApiDefinition())
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

  @ApiProperty(multiFileApiDefinition())
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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  data: string;

  @ApiProperty(multiFileApiDefinition())
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

  @ApiProperty(multiFileApiDefinition())
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
