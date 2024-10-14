import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { paginationOptions } from './common.validation';
import { Type } from 'class-transformer';

export class QueryCategories extends paginationOptions {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

export class CategoryValidator {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CategoryFileUpload {
  @IsFile()
  @MaxFileSize(4e6, {
    message: 'Maximum size of the file should be 4 mega byte',
  })
  @HasMimeType([mimeTypes.image], {
    message: 'File must be an image',
  })
  file: Express.Multer.File;
}

export class CreateCatValidation extends CategoryFileUpload {
  @IsString()
  @IsNotEmpty()
  data: string;
}
