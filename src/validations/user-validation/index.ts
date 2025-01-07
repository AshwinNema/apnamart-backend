import { UserRole } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize } from 'nestjs-form-data';
import { mimeTypes } from 'src/utils';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export * from './update-validations';

export class ProfilePhotoValidation {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Profile photo file',
  })
  @IsFile()
  @MaxFileSize(6e6, { message: 'Maximum size of the file must be 6 mega byte' })
  @HasMimeType(mimeTypes.image, {
    message: 'File must be an image',
  })
  file: Express.Multer.File;
}

export class ProfileValidation {
  @ApiProperty({
    enum: UserRole,
    description: 'Role of the user',
    example: UserRole.customer,
  })
  @IsEnum(UserRole)
  @IsString()
  @IsNotEmpty()
  role: UserRole;
}

export class QueryLocations {
  @ApiProperty({
    description: 'Search query for locations',
    example: 'New York',
  })
  @IsNotEmpty()
  @IsString()
  input: string;
}

export class GetAddress {
  @ApiProperty({ description: 'Latitude of the address', example: 40.7128 })
  @Min(-90)
  @Max(90)
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @ApiProperty({ description: 'Longitude of the address', example: -74.006 })
  @Min(-180)
  @Max(180)
  @IsNumber()
  @Type(() => Number)
  lng: number;
}

export class GetUserProfile {
  @ApiPropertyOptional({
    description: 'Flag to get merchant details',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  getMerchantDetails: boolean;
}
