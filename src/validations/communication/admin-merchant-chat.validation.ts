import { IsEnum, IsInt, IsOptional, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export enum adminMerchantChatRole {
  admin = `admin`,
  merchant = 'merchant',
}

export class initialAdminMerchantChat {
  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit: number;

  @IsEnum(adminMerchantChatRole)
  role: adminMerchantChatRole;

  @ValidateIf((details) => details.role === adminMerchantChatRole.admin)
  @Min(1)
  @IsInt()
  merchantRegistrationId: number;
}

export class queryAdminMerchantChatMsgs {
  @Min(1)
  @IsInt()
  cursor: number;

  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit: number;
}

export class reinitiateMerchantAdminChat {
  @IsOptional()
  @Min(1)
  @IsInt()
  cursor: number;

  @IsEnum(adminMerchantChatRole)
  role: string;

  @ValidateIf((details) => details.role === adminMerchantChatRole.admin)
  @Min(1)
  @IsInt()
  merchantRegistrationId: adminMerchantChatRole;
}
