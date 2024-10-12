import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { paginationOptions } from './common.validation';
import { Type } from 'class-transformer';

export class QuerySubCategories extends paginationOptions {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

export class SubCategoryValidator {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoryId: number;
}

export class SubCatListValidator {
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  categoryId: number;
}

export class SubcategoryUploadFile {
  @IsFile()
  @MaxFileSize(4e6, {
    message: 'Maximum size of the file should be 4 mega byte',
  })
  @HasMimeType(mimeTypes.image, {
    message: 'File must be an image',
  })
  file: Express.Multer.File;
}

export class CreateSubCatValidation extends SubcategoryUploadFile {
  @IsString()
  @IsNotEmpty()
  data: string;
}
