import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { LatLng } from '../common.validation';
import { AddressType, PaymentMode } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutItem {
  @ApiProperty({ description: 'Quantity of the product', example: 2 })
  @Min(1)
  @IsInt()
  quantity: number;

  @ApiProperty({ description: 'Id of the product', example: 1 })
  @Min(1)
  @IsInt()
  productId: number;
}

export class CreateCheckoutValidation {
  @ApiProperty({
    type: [CheckoutItem],
    description: 'List of items to checkout',
    example: [{ quantity: 2, productId: 1 }],
  })
  @ArrayUnique((item) => item.productId)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => CheckoutItem)
  @IsOptional()
  items: CheckoutItem[];
}

export class CheckoutAddressUpdate extends LatLng {
  @ApiProperty({
    enum: AddressType,
    description: 'Type of address',
    example: AddressType.home,
  })
  @IsEnum(AddressType)
  @IsString()
  @IsOptional()
  addressType: AddressType;

  @ApiProperty({
    description: 'First line of the address',
    example: '123 Main St',
  })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  addressLine1: string;

  @ApiProperty({ description: 'Second line of the address', example: 'Apt 4B' })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  addressLine2: string;

  @ApiPropertyOptional({
    description: 'Additional address details',
    example: 'Near the park',
  })
  @ValidateIf((location) => location.addressType === AddressType.others)
  @IsNotEmpty()
  @IsString()
  otherAddress: string;
}

export class ChangePaymentMode {
  @ApiProperty({
    enum: PaymentMode,
    description: 'Mode of payment',
    example: PaymentMode.cash,
  })
  @IsEnum(PaymentMode)
  paymentMode: PaymentMode;
}
