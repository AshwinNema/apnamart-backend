import { IsEnum, IsString } from 'class-validator';

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
