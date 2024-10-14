import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token/token.service';
import { TokenService2 } from './token/token2.service';
import { ConfigService } from '@nestjs/config';
import {
  LogoutValidator,
  RefreshTokenValidator,
  registerUser,
} from 'src/validations';
import { TokenTypes } from '@prisma/client';
import prisma from 'src/prisma/client';
import { UserService } from 'src/user-entites/user/user.service';
import {
  TokenVerificationService,
  verifyTokenErrs,
} from './token/token-verification.service';

@Injectable()
export class Auth2Service {
  private readonly logger = new Logger(Auth2Service.name);
  constructor(
    private tokenService: TokenService,
    private tokenService2: TokenService2,
    private tokenVerificationService: TokenVerificationService,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async refreshToken(tokenDetails: RefreshTokenValidator) {
    const token = await this.tokenVerificationService.verifyToken(
      tokenDetails.token,
      TokenTypes.refresh,
      this.configService.get('jwt').refresh_secret,
      verifyTokenErrs.http,
      new UnauthorizedException('Forbidden'),
    );
    this.tokenService2.deleteOneToken({ id: token.id });
    return this.tokenService.generateAuthTokens(token.userId);
  }

  async logout(tokens: LogoutValidator) {
    try {
      const promises = [
        prisma.token.delete({
          where: { token: tokens.access, type: TokenTypes.access },
        }),
        prisma.token.delete({
          where: { token: tokens.refresh, type: TokenTypes.refresh },
        }),
      ];
      await Promise.allSettled(promises);
    } catch (err) {
      this.logger.error(err.message);
    }

    return { success: true };
  }

  async register(userDetails: registerUser) {
    const user = await this.userService.findUnique({
      email: userDetails.email,
    });

    const userRoles = [userDetails.role];
    delete userDetails.role;
    let registeredUser;
    if (user) {
      if (user.userRoles.includes(userRoles[0])) {
        throw new BadRequestException('User already has the given role');
      } else {
        registeredUser = await this.userService.updateUser(
          {
            email: userDetails.email,
          },
          {
            ...userDetails,
            userRoles: {
              push: userRoles,
            },
          },
        );
      }
    } else {
      registeredUser = await this.userService.createUser({
        ...userDetails,
        userRoles,
      });
    }
    const registeredUserId: number = registeredUser.id;
    const tokens = await this.tokenService.generateAuthTokens(registeredUserId);

    return {
      user: { ...registeredUser, role: registeredUser.userRoles[0] },
      tokens,
    };
  }
}
