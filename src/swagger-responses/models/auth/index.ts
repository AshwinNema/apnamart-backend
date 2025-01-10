import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { LoginUser } from './login';

export class RegisteredAdmin {
  @ApiProperty({
    description: 'Id of the user',
    example: 1,
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Roles assigned to the user',
    type: [UserRole],
    enum: UserRole,
    example: [UserRole.admin],
    enumName: 'UserRole',
  })
  userRoles: UserRole[];

  @ApiProperty({
    description: 'Name of the user',
    example: 'John Doe',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'Role of the user',
    example: UserRole.admin,
    type: String,
  })
  role: UserRole;
}

export class AccessTokenResponse {
  @ApiProperty({
    description: 'JWT access token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MTczOTAyODk4MCwidHlwZSI6ImFjY2VzcyIsImlhdCI6MTczNjQzNjk4MH0.xjIHYjjczT8Sb5lwzU8bTF_YVSAluAKTX22SJa26s4zA',
    type: String,
  })
  token: string;

  @ApiProperty({
    description: 'Expiration date of the access token',
    example: '2025-02-08T15:36:20.171Z',
    type: String,
  })
  expires: string;
}

export class RefreshTokenResponse {
  @ApiProperty({
    description: 'JWT refresh token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MTczOTAyODk4MCwidHlwZSI6InJlZnJlc2giLCJpYXQiOjE3MzY0MzY5ODB9.RHsx98djSp7TMO1xdwMwdyANXpAREwMaebJubZJIVWY',
    type: String,
  })
  token: string;

  @ApiProperty({
    description: 'Expiration date of the refresh token',
    example: '2025-02-08T15:36:20.171Z',
    type: String,
  })
  expires: string;
}

export class TokenResponse {
  @ApiProperty({
    description: 'Access token information',
    type: AccessTokenResponse,
  })
  access: AccessTokenResponse;

  @ApiProperty({
    description: 'Refresh token information',
    type: RefreshTokenResponse,
  })
  refresh: RefreshTokenResponse;
}

export * from './login';
