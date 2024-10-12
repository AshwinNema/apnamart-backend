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
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole)
  @IsString()
  @IsNotEmpty()
  role: UserRole;
}

export class LogoutValidator {
  @IsString()
  @IsNotEmpty()
  access: string;

  @IsString()
  @IsNotEmpty()
  refresh: string;
}

export class RegisterAdminValidator {
  @Transform(({ value }) => value?.trim()?.toLowerCase())
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(passwordValidation.regex, {
    message: passwordValidation.message,
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class registerUser extends RegisterAdminValidator {
  @IsEnum(NonAdminRoleEnum)
  @IsString()
  @IsNotEmpty()
  role: NonAdminRoles;
}

export class RefreshTokenValidator {
  @IsNotEmpty()
  @IsString()
  token: string;
}

export * from './other-validations';
