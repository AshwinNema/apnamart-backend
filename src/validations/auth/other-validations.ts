import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum authAccessType {
  login = 'login',
  signUp = 'signUp',
}

export class GoogleAuth {
  @IsEnum(UserRole)
  @IsString()
  role: UserRole;

  @IsString()
  token: string;

  @IsEnum(authAccessType)
  @IsString()
  @IsNotEmpty()
  accessType: authAccessType;
}

export class TwitterAccessToken {
  @IsString()
  oauth_token: string;

  @IsString()
  oauth_verifier: string;

  @IsEnum(UserRole)
  @IsString()
  @IsNotEmpty()
  role: UserRole;

  @IsEnum(authAccessType)
  @IsString()
  @IsNotEmpty()
  accessType: authAccessType;
}
