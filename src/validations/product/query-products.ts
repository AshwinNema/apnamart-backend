import { IsArray, IsInt, IsOptional, Min } from 'class-validator';
import { paginationOptions } from '../common.validation';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryProducts extends paginationOptions {
  @ApiPropertyOptional({ description: 'Product Id', example: 1 })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;
}

export class QueryCustomerProducts extends paginationOptions {
  @ApiPropertyOptional({
    description: 'Item Id to which the product is linked',
    example: 1,
  })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  itemId: number;

  @ApiPropertyOptional({ description: 'Sub category Id', example: 2 })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  subCategoryId: number;

  @ApiPropertyOptional({
    description: 'Filter options as a comma-separated list of numbers',
    example: '1,2,3',
  })
  @Transform(({ value }) => {
    return value.split(',').map((optionId) => Number(optionId));
  })
  @IsInt({ each: true })
  @IsArray()
  @IsOptional()
  filterOptions: number[];

  @ApiPropertyOptional({ description: 'Minimum price', example: 100 })
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  minPrice: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: 500 })
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  maxPrice: number;
}
