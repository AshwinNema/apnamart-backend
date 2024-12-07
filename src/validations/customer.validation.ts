import { IsEnum, IsInt, IsString, Min, ValidateIf } from 'class-validator';

export enum booleanEnum {
  true = 'true',
  false = 'false',
}

export class AddRemoveWishlistItem {
  @IsEnum(booleanEnum)
  @IsString()
  connect: string;
}

export class AddRemoveCartItem {
  @IsEnum(booleanEnum)
  @IsString()
  connect: string;
}

export enum itemCountChange {
  increase = 1,
  decrease = -1,
}

export class IncreaseDecreaseCartItem {
  @ValidateIf((details) => !details.change)
  @Min(1)
  @IsInt()
  quantity: number;

  @ValidateIf((details) => !details.quantity)
  @IsInt()
  @IsEnum(itemCountChange)
  change: -1 | 1;
}
