import { CommonLoginUserResponse } from './common';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { LoginAddress } from './address';
import {
  addressExample,
  merchantRegistrationDetailsExample,
  tokenExample,
} from 'src/swagger-responses/examples';
import { LoginMerchantRegistrationDetails } from './merchant-registration-details';
import { TokenResponse } from '..';

export { TokenResponse };

export class UserLoginResponse extends CommonLoginUserResponse {
  @ApiProperty({
    description: 'Role of the user',
    example: UserRole.customer,
    type: String,
  })
  role: UserRole;

  @ApiProperty({
    description: 'Address of the customer',
    example: addressExample,
    type: LoginAddress,
  })
  address: LoginAddress;

  @ApiProperty({
    description: 'Details of the merchant registration',
    example: merchantRegistrationDetailsExample,
    type: LoginMerchantRegistrationDetails,
  })
  merchantDetails: LoginMerchantRegistrationDetails;
}

export class LoginUser {
  @ApiProperty({
    description: 'User details',
    type: () => UserLoginResponse,
  })
  user: UserLoginResponse;

  @ApiProperty({
    description: 'Token details',
    type: () => TokenResponse,
    example: tokenExample,
  })
  tokens: TokenResponse;
}

export class OtherAuthLogin extends LoginUser {
  @ApiProperty({
    description: 'Indicates if the user is new',
    example: true,
    type: Boolean,
  })
  isNewUser: boolean;

  @ApiProperty({
    description: 'Indicates if the user has not seted its password',
    example: true,
    type: Boolean,
  })
  noInitialPassword: boolean;
}

export class OAuthTokenResponse {
  @ApiProperty({
    description: 'OAuth token',
    example: '7588892-kagSNqWge8gB1WwE3plnFsJHAZVfxWD7Vb57p0b4',
    type: String,
  })
  oauth_token: string;

  @ApiProperty({
    description: 'OAuth token secret',
    example: 'cChZNFj6T5R0TigYB9yd1w',
    type: String,
  })
  oauth_token_secret: string;

  @ApiProperty({
    description: 'OAuth callback confirmed',
    example: 'true',
    type: String,
  })
  oauth_callback_confirmed: string;
}
