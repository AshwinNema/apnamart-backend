import { AddressType } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
} from 'class-validator';
import { passwordValidation } from 'src/utils';
import { LatLng } from '../common.validation';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserAddress extends LatLng {
  @ApiProperty({
    enum: AddressType,
    description: 'Type of the address',
    example: AddressType.home,
  })
  @IsEnum(AddressType)
  @IsString()
  addressType: AddressType;

  @ApiProperty({
    description: 'First line of the address',
    example: '123 Main St',
  })
  @IsNotEmpty()
  @IsString()
  addressLine1: string;

  @ApiProperty({ description: 'Second line of the address', example: 'Apt 4B' })
  @IsNotEmpty()
  @IsString()
  addressLine2: string;

  @ApiProperty({
    description: 'Other address details if address type is others',
    example: 'Near Central Park',
  })
  @ValidateIf((location) => location.addressType === AddressType.others)
  @IsNotEmpty()
  @IsString()
  otherAddress: string;
}
export class UpdateUserProfile {
  @ApiPropertyOptional({
    description: 'Email of the user',
    example: 'user@example.com',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiPropertyOptional({ description: 'Name of the user', example: 'John Doe' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @ApiPropertyOptional({
    description: 'Password of the user',
    example: 'Test1234',
  })
  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;
}
