import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { CustomDigitLengthValidator, LatLng } from '../../common.validation';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export * from './other-validations';
export class MerchantRegistrationDetails extends LatLng {
  @ApiProperty({
    example: 'Cloudtail pvt ltd',
    description: 'Name of the organization of the merchant',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'We are a small firm, operating in 500 cities',
    description: 'Description of the business',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: '123 Main St',
    description: 'Primary address line of the merchant',
  })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiProperty({
    example: 'Apt 4B',
    description: 'Secondary address line of the merchant',
  })
  @IsString()
  @IsNotEmpty()
  addressLine2: string;

  @ApiProperty({
    example: 123456,
    description: "Pin code of the merchant's address",
  })
  @Transform(({ value }) => Number(value))
  @Validate(CustomDigitLengthValidator, [6], {
    message: 'Pin code should be exactly six digits',
  })
  pinCode: number;

  @ApiProperty({
    example: 'ABCDE1234F',
    description: 'PAN card number of the merchant',
  })
  @IsString()
  @IsNotEmpty()
  panCard: string;

  @ApiProperty({
    example: '22AAAAA0000A1Z5',
    description: 'GSTIN of the merchant',
  })
  @IsString()
  @IsNotEmpty()
  gstIn: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Bank account number of the merchant',
  })
  @IsString()
  @IsNotEmpty()
  bankAcNo: string;
}
