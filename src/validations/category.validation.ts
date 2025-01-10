import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { paginationOptions } from './common.validation';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryCategories extends paginationOptions {
  @ApiProperty({
    required: false,
    description: 'Id of the category',
    example: 1,
  })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

export class CategoryValidator {
  @ApiProperty({ description: 'Name of the category', example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CategoryFileUpload {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to be uploaded',
  })
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
  @ApiProperty({
    description: 'Additional data for the category',
    example: '{"key": "value"}',
  })
  @IsString()
  @IsNotEmpty()
  data: string;
}
