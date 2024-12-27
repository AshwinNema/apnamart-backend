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

export class CheckoutItem {
  @Min(1)
  @IsInt()
  quantity: number;

  @Min(1)
  @IsInt()
  productId: number;
}

export class CreateCheckoutValidation {
  @ArrayUnique((item) => item.productId)
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => CheckoutItem)
  @IsOptional()
  items: CheckoutItem[];
}

export class CheckoutAddressUpdate extends LatLng {
  @IsEnum(AddressType)
  @IsString()
  @IsOptional()
  addressType: AddressType;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  addressLine1: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  addressLine2: string;

  @ValidateIf((location) => location.addressType === AddressType.others)
  @IsNotEmpty()
  @IsString()
  otherAddress: string;
}

export class ChangePaymentMode {
  @IsEnum(PaymentMode)
  paymentMode: PaymentMode;
}
