import { IsEnum, IsInt, IsString, Min, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum booleanEnum {
  true = 'true',
  false = 'false',
}

export class AddRemoveWishlistItem {
  @ApiProperty({
    enum: booleanEnum,
    description:
      'Indicates whether to add or remove item from wishlist. true means that item should be added in wishlist false means it should be removed from wishlist',
    example: 'true',
  })
  @IsEnum(booleanEnum)
  @IsString()
  connect: string;
}

export class AddRemoveCartItem {
  @ApiProperty({
    enum: booleanEnum,
    description:
      'Indicates whether to add or remove item from the cart. true means to add item in the cart, false means to remove item from the cart',
    example: 'true',
  })
  @IsEnum(booleanEnum)
  @IsString()
  connect: string;
}

export enum itemCountChange {
  increase = 1,
  decrease = -1,
}

export class IncreaseDecreaseCartItem {
  @ApiProperty({
    description: 'Quantity of the item to be added or removed',
    example: 1,
  })
  @ValidateIf((details) => !details.change)
  @Min(1)
  @IsInt()
  quantity: number;

  @ApiProperty({
    enum: itemCountChange,
    description:
      'Indicates whether to increase or decrease the item count by 1',
    example: 1,
  })
  @ValidateIf((details) => !details.quantity)
  @IsInt()
  @IsEnum(itemCountChange)
  change: -1 | 1;
}
