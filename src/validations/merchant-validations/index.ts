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

export * from './registration.validations';

export class QueryMerchants extends paginationOptions {
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  name: string;

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
  @IsEnum(blockUnblockMerchantType)
  type: string;

  @Min(1)
  @IsInt()
  merchantRegistrationId: number;

  @IsInt()
  userId: number;
}
