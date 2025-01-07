import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { paginationOptions } from '../../common.validation';
import { Type } from 'class-transformer';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { MerchantRegistrationStatus } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class MerchantRegistrationFile {
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

export class CreateMerchantRegistration extends MerchantRegistrationFile {
  @ApiProperty({
    example:
      '{"name":"John Doe","description":"We are a small firm, operating in 500 cities","addressLine1":"123 Main St","addressLine2":"Apt 4B","pinCode":123456,"panCard":"ABCDE1234F","gstIn":"22AAAAA0000A1Z5","bankAcNo":"1234567890"}',
    description: 'JSON string containing merchant registration details',
  })
  @IsString()
  @IsNotEmpty()
  data: string;
}

export class QueryMerchantRegistrations extends paginationOptions {
  @ApiProperty({
    required: false,
    example: 'John Doe',
    description: 'Name of the merchant',
  })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({
    required: false,
    example: 1,
    description: 'Id of the merchant registration',
  })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  id: number;

  @ApiProperty({
    required: false,
    enum: MerchantRegistrationStatus,
    example: MerchantRegistrationStatus.review_by_admin,
    description: 'Status of the merchant registration',
  })
  @IsOptional()
  @IsEnum(MerchantRegistrationStatus)
  registrationStatus: MerchantRegistrationStatus;

  @ApiProperty({
    required: false,
    example: false,
    description: 'Indicates if the merchant is blocked',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isMerchantBlocked: boolean;
}
