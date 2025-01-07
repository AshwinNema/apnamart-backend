import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { paginationOptions } from '../common.validation';
import { IsNull } from '..';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export * from './registration-validations';
export class QueryMerchants extends paginationOptions {
  @ApiPropertyOptional({
    description: 'Name of the merchant',
    example: 'Ashwin',
  })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    description:
      'flag for getting only those merchants whose registration is not started',
    example: null,
  })
  @IsNull()
  @IsOptional()
  @Transform(() => null)
  merchantDetails: null;
}

export enum blockUnblockMerchantType {
  block = 'block',
  unblock = 'unblock',
}

export class blockUnblockMerchant {
  @ApiProperty({
    description:
      'Type of action to perform on the merchant to block or unblock it',
    enum: blockUnblockMerchantType,
    example: blockUnblockMerchantType.block,
  })
  @IsEnum(blockUnblockMerchantType)
  type: string;

  @ApiProperty({ description: 'Id of the merchant registration', example: 1 })
  @Min(1)
  @IsInt()
  merchantRegistrationId: number;

  @ApiProperty({
    description: 'Id of the merchant associated with the registration',
    example: 1,
  })
  @IsInt()
  userId: number;
}
