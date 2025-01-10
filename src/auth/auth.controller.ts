import {
  Controller,
  Post,
  Body,
  Query,
  Req,
  Next,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SkipAccessAuth } from './jwt/access.jwt';
import {
  RegisterAdminValidator,
  LoginValidator,
  registerUser,
  RefreshTokenValidator,
  GoogleAuth,
  TwitterAccessToken,
  LogoutValidator,
} from 'src/validations';
import { TokenService2 } from 'src/auth/token/token2.service';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { TwitterAuthService } from './twitter-auth/twitter-auth.service';
import { TwitterAccessAuthGuard } from './jwt/twitter.jwt';
import { User } from 'src/decorators';
import { Auth2Service } from './auth2.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import {
  LogoutSuccessResponse,
  RegisterAdminResponse,
} from 'src/swagger-responses';

import {
  LoginUser,
  OAuthTokenResponse,
  OtherAuthLogin,
  TokenResponse,
} from 'src/swagger-responses/models';
import { loginExamples } from 'src/swagger-responses/examples';

@SkipAccessAuth()
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private auth2Service: Auth2Service,
    private tokenService2: TokenService2,
    private googleAuthService: GoogleAuthService,
    private twitterAuthService: TwitterAuthService,
  ) {}

  @ApiInternalServerErrorResponse({
    description: 'User with the email is already present in the system',
  })
  @ApiCreatedResponse({
    type: RegisterAdminResponse,
    description: 'Registered admin user with tokens',
  })
  @ApiBadRequestResponse({
    description: 'Payload data is not of valid format',
  })
  @Post('register-admin')
  async registerAdmin(@Body() userDetails: RegisterAdminValidator) {
    return this.authService.registerAdmin(userDetails);
  }

  @ApiCreatedResponse({
    type: LoginUser,
    description: 'Details of the user logged in',
    examples: loginExamples,
  })
  @ApiBadRequestResponse({
    description:
      'Payload data is not of valid format/ Insufficient role permission',
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  @ApiUnauthorizedResponse({
    description: 'Password provided by the user is not valid',
  })
  @Post('login')
  async login(@Body() loginCredentails: LoginValidator) {
    return this.authService.login(loginCredentails);
  }

  @ApiBadRequestResponse({
    description: 'Payload data is not of valid format',
  })
  @ApiCreatedResponse({
    description:
      'Access and refresh tokens are successfully removed from the database',
    type: LogoutSuccessResponse,
  })
  @Post('logout')
  async logout(@Body() body: LogoutValidator) {
    return this.auth2Service.logout(body);
  }

  @ApiBadRequestResponse({
    description:
      'Payload data is not of valid format/ User already has the given role',
  })
  @ApiCreatedResponse({
    type: LoginUser,
    description: 'Details of the user registered',
    examples: loginExamples,
  })
  @Post('register')
  async register(@Body() userDetails: registerUser) {
    return this.auth2Service.register(userDetails);
  }

  @ApiBadRequestResponse({
    description: 'Payload data is not of valid format',
  })
  @ApiUnauthorizedResponse({
    description: 'Token validation failed',
  })
  @ApiNotFoundResponse({
    description: 'Token not found',
  })
  @ApiCreatedResponse({
    description: 'Access and refresh tokens',
    type: TokenResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Failed to verify token',
  })
  @Post('refresh-token')
  async refreshToken(@Body() tokenDetails: RefreshTokenValidator) {
    return this.auth2Service.refreshToken(tokenDetails);
  }

  @ApiInternalServerErrorResponse({
    description: 'Failed to verify google token',
  })
  @ApiBadRequestResponse({
    description: 'Payload data is not of valid format',
  })
  @ApiCreatedResponse({
    description: 'User details when user logs in/signs up with a google token',
    type: OtherAuthLogin,
  })
  @Post('google')
  async googleAuth(@Body() loginCredentails: GoogleAuth) {
    return this.googleAuthService.googleLoginSignUp(loginCredentails);
  }

  @ApiCreatedResponse({
    description: 'Token details',
    type: OAuthTokenResponse,
  })
  @Post('twitter/request-token')
  async requestToken() {
    return this.twitterAuthService.requestToken();
  }

  @Post('twitter/access-token')
  async generateAccessToken(
    @Query() query: TwitterAccessToken,
    @Req() req,
    @Next() next,
  ) {
    this.twitterAuthService.generateAccessToken(query, req, next);
  }

  @ApiBadRequestResponse({
    description: 'Payload data is not of valid format',
  })
  @ApiCreatedResponse({
    description: 'User details when user logs in/signs up with a twitter token',
    type: OtherAuthLogin,
  })
  @UseGuards(TwitterAccessAuthGuard)
  @Post('twitter/access-token')
  async getUserToken(@Query() query: TwitterAccessToken, @User() userProfile) {
    return this.tokenService2.generateDifferentLoginToken(
      userProfile.userDetails,
      { role: query.role, name: userProfile.name, email: userProfile.email },
    );
  }
}
