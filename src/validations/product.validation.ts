import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { HasMimeType, IsFile, IsFiles, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';

export class Product {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(0)
  quantity: string;

  @IsString()
  description: string;

  @IsInt()
  itemId: number;

  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber({}, { each: true })
  @IsArray()
  @ArrayUnique((optionId) => optionId)
  filterOptions: number[];

  @IsBoolean()
  available: boolean;
}

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

  @IsFile()
  @MaxFileSize(2e6, {
    message: 'Maximum size of the file should be 2 mega byte',
  })
  @HasMimeType(mimeTypes.imageOrVideo, {
    message: 'File must be an image or video',
  })
  file: Express.Multer.File;

  @IsFiles()
  @MaxFileSize(2e6, {
    each: true,
    message: 'Maximum size of the files should be 2 mega byte',
  })
  @HasMimeType(mimeTypes.imageOrVideo, {
    each: true,
    message: 'Files must be an image or video',
  })
  files: Express.Multer.File[];
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
