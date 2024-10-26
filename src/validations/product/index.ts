import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { HasMimeType, IsFile, IsFiles, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { z } from 'zod';

export const basicProductDetailsValidation = z.object({
  name: z.string().min(1),
  itemId: z.number().int().positive(),
  price: z.number().positive(),
  filterOptions: z.array(z.number().positive().int()),
});

export class UpdateProduct {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  @IsArray()
  @ArrayUnique((optionId) => optionId)
  filterOptions: number[];

  @IsOptional()
  @IsBoolean()
  available: boolean;
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

export class UpdateProductResource {
  @IsFile()
  @MaxFileSize(2e6, {
    message: 'Maximum size of the file should be 2 mega byte',
  })
  @HasMimeType(mimeTypes.imageOrVideo, {
    message: 'File must be an image or video',
  })
  file: Express.Multer.File;
}
