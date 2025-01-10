import { ApiProperty } from '@nestjs/swagger';
import { registeredAdminExample, tokenExample } from '../examples';
import { RegisteredAdmin, TokenResponse } from '../models/auth';

export class RegisterAdminResponse {
  @ApiProperty({
    description: 'User object containing user details',
    example: registeredAdminExample,
    type: RegisteredAdmin,
  })
  user: RegisteredAdmin;

  @ApiProperty({
    description: 'Tokens object containing access and refresh tokens',
    example: tokenExample,
  })
  tokens: TokenResponse;
}

export class LogoutSuccessResponse {
  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Indicates that tokens are deleted successfully or not',
  })
  success: true;
}
