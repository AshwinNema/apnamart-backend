import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { NonAdminRoleEnum, NonAdminRoles } from 'src/utils';
import { RegisterAdminValidator } from '.';

export enum authAccessType {
  login = 'login',
  signUp = 'signUp',
}

export class GoogleAuth {
  @ApiProperty({
    enum: UserRole,
    example: UserRole.admin,
    description: 'Role of the user',
  })
  @IsEnum(UserRole)
  @IsString()
  role: UserRole;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Token generated from google sign in for authentication',
  })
  @IsString()
  token: string;

  @ApiProperty({
    enum: authAccessType,
    example: authAccessType.login,
    description: 'Type of authentication access',
  })
  @IsEnum(authAccessType)
  @IsString()
  @IsNotEmpty()
  accessType: authAccessType;
}

export class TwitterAccessToken {
  @ApiProperty({
    example: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4',
    description: 'OAuth token for Twitter authentication',
  })
  @IsString()
  oauth_token: string;

  @ApiProperty({
    example: 'uw7NjWHT6OJ1MpJOXsHfNxoAhPKpgI8BlYDhxEjIBY',
    description: 'OAuth verifier for Twitter authentication',
  })
  @IsString()
  oauth_verifier: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.customer,
    description: 'Role of the user',
  })
  @IsEnum(UserRole)
  @IsString()
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({
    enum: authAccessType,
    example: authAccessType.signUp,
    description: 'Type of authentication access',
  })
  @IsEnum(authAccessType)
  @IsString()
  @IsNotEmpty()
  accessType: authAccessType;
}
export class registerUser extends RegisterAdminValidator {
  @ApiProperty({
    enum: NonAdminRoleEnum,
    example: NonAdminRoleEnum.customer,
    description: "User's role",
  })
  @IsEnum(NonAdminRoleEnum)
  @IsString()
  @IsNotEmpty()
  role: NonAdminRoles;
}

export class RefreshTokenValidator {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Refresh token',
  })
  @IsNotEmpty()
  @IsString()
  token: string;
}
