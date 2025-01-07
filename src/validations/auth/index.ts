import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  IsString,
  IsEnum,
} from 'class-validator';
import { NonAdminRoleEnum, NonAdminRoles, passwordValidation } from 'src/utils';

export class LoginValidator {
  @ApiProperty({
    example: 'user@example.com',
    description: "User's registered email address",
  })
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Test1234',
    description: "User's password",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.customer,
    description: "User's role",
  })
  @IsEnum(UserRole)
  @IsString()
  @IsNotEmpty()
  role: UserRole;
}

export class LogoutValidator {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Access token',
  })
  @IsString()
  @IsNotEmpty()
  access: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
    description: 'Refresh token',
  })
  @IsString()
  @IsNotEmpty()
  refresh: string;
}

export class RegisterAdminValidator {
  @ApiProperty({
    example: 'admin@example.com',
    description: "Admin's email address",
  })
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Admin Name',
    description: "Admin's name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'Test1234',
    description: "Admin's password",
  })
  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export * from './other-validations';
