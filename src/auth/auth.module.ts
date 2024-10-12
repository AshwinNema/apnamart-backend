import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessStrategy, JwtAccessAuthGuard } from './jwt/access.jwt';
import { TokenService } from 'src/auth/token/token.service';
import { envConfig } from 'src/config/config';
import { TokenService2 } from 'src/auth/token/token2.service';
import { RolesGuard } from './role/role.guard';
import { UserEntitesModule } from 'src/user-entites/user-entites.module';
import { GoogleAuthService } from './google-auth/google-auth.service';
import { TwitterAuthService } from './twitter-auth/twitter-auth.service';
import { TwitterAcessStrategy } from './jwt/twitter.jwt';
import { Auth2Service } from './auth2.service';
import { TokenVerificationService } from './token/token-verification.service';

@Module({
  imports: [
    PassportModule,
    UserEntitesModule,
    JwtModule.register({
      global: true,
      secret: envConfig?.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: envConfig?.JWT_ACCESS_EXPIRATION },
    }),
    JwtModule.register({
      secret: envConfig?.JWT_REFRESH_SECRET,
      signOptions: {
        expiresIn: envConfig?.JWT_REFRESH_EXPIRATION,
      },
    }),
  ],
  providers: [
    AuthService,
    JwtAccessStrategy,
    TwitterAcessStrategy,
    TokenService2,
    {
      provide: APP_GUARD,
      useClass: JwtAccessAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    TokenService,
    GoogleAuthService,
    TwitterAuthService,
    Auth2Service,
    TokenVerificationService,
  ],
  controllers: [AuthController],
  exports: [TokenService, TokenService2, TokenVerificationService],
})
export class AuthModule {}
