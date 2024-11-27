import { Type } from 'class-transformer';
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

  @Min(1)
  @IsInt()
  @Type(() => Number)
  @ValidateIf((details) => details.connect === booleanEnum.true)
  quantity: number;
}
