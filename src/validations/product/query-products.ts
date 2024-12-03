import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { paginationOptions } from '../common.validation';
import { Transform, Type } from 'class-transformer';

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

  @Transform(({ value }) => {
    return value.split(',').map((optionId) => Number(optionId));
  })
  @IsInt({ each: true })
  @IsArray()
  @IsOptional()
  filterOptions: number[];

  @IsInt()
  @Type(() => Number)
  @IsOptional()
  minPrice: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  maxPrice: number;
}
