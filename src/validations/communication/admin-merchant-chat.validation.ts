import { IsEnum, IsInt, IsOptional, Min, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum adminMerchantChatRole {
  admin = `admin`,
  merchant = 'merchant',
}

export class initialAdminMerchantChat {
  @ApiProperty({ example: 10 })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit: number;

  @ApiProperty({
    enum: adminMerchantChatRole,
    example: adminMerchantChatRole.admin,
  })
  @IsEnum(adminMerchantChatRole)
  role: adminMerchantChatRole;

  @ApiProperty({ example: 123 })
  @ValidateIf((details) => details.role === adminMerchantChatRole.admin)
  @Min(1)
  @IsInt()
  merchantRegistrationId: number;
}

export class queryAdminMerchantChatMsgs {
  @ApiProperty({ example: 5 })
  @Min(1)
  @IsInt()
  cursor: number;

  @ApiProperty({ example: 10 })
  @Min(1)
  @IsInt()
  @Type(() => Number)
  limit: number;
}

export class reinitiateMerchantAdminChat {
  @ApiProperty({ example: 5 })
  @IsOptional()
  @Min(1)
  @IsInt()
  cursor: number;

  @ApiProperty({
    enum: adminMerchantChatRole,
    example: adminMerchantChatRole.merchant,
  })
  @IsEnum(adminMerchantChatRole)
  role: string;

  @ApiProperty({ example: 123 })
  @ValidateIf((details) => details.role === adminMerchantChatRole.admin)
  @Min(1)
  @IsInt()
  merchantRegistrationId: adminMerchantChatRole;
}
