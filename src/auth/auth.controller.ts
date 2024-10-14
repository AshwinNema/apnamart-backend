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

  @Post('register-admin')
  async registerAdmin(@Body() userDetails: RegisterAdminValidator) {
    return this.authService.registerAdmin(userDetails);
  }

  @Post('login')
  async login(@Body() loginCredentails: LoginValidator) {
    return this.authService.login(loginCredentails);
  }

  @Post('logout')
  async logout(@Body() body: LogoutValidator) {
    return this.auth2Service.logout(body);
  }

  @Post('register')
  async register(@Body() userDetails: registerUser) {
    return this.auth2Service.register(userDetails);
  }

  @Post('refresh-token')
  async refreshToken(@Body() tokenDetails: RefreshTokenValidator) {
    return this.auth2Service.refreshToken(tokenDetails);
  }

  @Post('google')
  async googleAuth(@Body() loginCredentails: GoogleAuth) {
    return this.googleAuthService.googleLoginSignUp(loginCredentails);
  }

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

  @UseGuards(TwitterAccessAuthGuard)
  @Post('twitter/access-token')
  async getUserToken(@Query() query: TwitterAccessToken, @User() userProfile) {
    return this.tokenService2.generateDifferentLoginToken(
      userProfile.userDetails,
      { role: query.role, name: userProfile.name, email: userProfile.email },
    );
  }
}
