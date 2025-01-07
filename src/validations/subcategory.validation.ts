import { IsNotEmpty, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { paginationOptions } from './common.validation';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QuerySubCategories extends paginationOptions {
  @ApiPropertyOptional({ description: 'Id of the subcategory', example: 1 })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

export class SubCategoryValidator {
  @ApiProperty({
    description: 'Name of the subcategory',
    example: 'Electronics',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Id of the category', example: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  categoryId: number;
}

export class SubCatListValidator {
  @ApiPropertyOptional({ description: 'Id of the category', example: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  categoryId: number;
}

export class SubcategoryUploadFile {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to be uploaded',
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

export class CreateSubCatValidation extends SubcategoryUploadFile {
  @ApiProperty({
    description: 'Data related to the subcategory',
  })
  @IsString()
  @IsNotEmpty()
  data: string;
}

export class UpdateSubCategoryValidation {
  @ApiPropertyOptional({
    description: 'Name of the subcategory',
    example: 'Gaming',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Id of the category', example: 1 })
  @Min(1)
  @IsInt()
  @IsOptional()
  categoryId: number;
}
