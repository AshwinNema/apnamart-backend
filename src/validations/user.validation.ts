import { AddressType, UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes, passwordValidation } from 'src/utils';
import { LatLng } from './common.validation';

export class ProfilePhotoValidation {
  @IsFile()
  @MaxFileSize(6e6, { message: 'Maximum size of the file must be 6 mega byte' })
  @HasMimeType(mimeTypes.image, {
    message: 'File must be an image',
  })
  file: Express.Multer.File;
}

export class ProfileValidation {
  @IsEnum(UserRole)
  @IsString()
  @IsNotEmpty()
  role: UserRole;
}

export class QueryLocations {
  @IsNotEmpty()
  @IsString()
  input: string;
}

export class GetAddress {
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lng: number;
}

export class UpdateUserAddress extends LatLng {
  @IsEnum(AddressType)
  @IsString()
  addressType: AddressType;

  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @IsNotEmpty()
  @IsString()
  addressLine2: string;

  @ValidateIf((location) => location.addressType === AddressType.others)
  @IsNotEmpty()
  @IsString()
  otherAddress: string;
}

export class UpdateUserProfile {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;
}
