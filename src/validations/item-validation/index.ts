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
import { paginationOptions } from '../common.validation';
import { Transform, Type } from 'class-transformer';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import {
  CreateFilterValidation,
  validateFilterType,
} from './filter-subvalidations';
export * from './item-update';

export class QueryItems extends paginationOptions {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

export class ItemFileUpload {
  @IsFile()
  @MaxFileSize(4e6, {
    message: 'Maximum size of the file should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    message: 'File must be an image',
  })
  file: Express.Multer.File;
}

export class CreateItemValidation {
  @IsOptional()
  @IsFile()
  @MaxFileSize(4e6, {
    message: 'Maximum size of the file should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    message: 'File must be an image',
  })
  file: Express.Multer.File;

  @IsString()
  @IsNotEmpty()
  data: string;
}

export class CreateItemValidator {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoryId: number;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  subCategoryId: number;

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

export class createItemFilterValidation extends CreateFilterValidation {
  @Min(1)
  @IsInt()
  itemId: number;
}

export class getItemListValidation {
  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  categoryId: number;

  @Min(1)
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  subCategoryId: number;
}
