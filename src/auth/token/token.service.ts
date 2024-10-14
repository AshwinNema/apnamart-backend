import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TokenTypes } from '@prisma/client';
import { getTokenExpiration } from 'src/utils';
import * as jwt from 'jsonwebtoken';
import prisma from 'src/prisma/client';

@Injectable()
export class TokenService {
  constructor(private configService: ConfigService) {}

  async saveToken(
    token: string,
    userId: number,
    expires: Date,
    type: TokenTypes,
    blackListed: boolean = false,
  ) {
    const savedToken = await prisma.token.create({
      data: {
        token,
        userId,
        expires,
        type,
        blackListed,
      },
    });

    return savedToken;
  }

  generateToken(
    userId: number,
    exp: number,
    type: string,
    secret: string,
  ): string {
    const payload = {
      sub: userId,
      exp,
      type,
    };

    return jwt.sign(payload, secret);
  }

  generateAuthTokens(userId: number) {
    const jwt = this.configService.get('jwt');
    const currentTime = Math.floor(Date.now() / 1000);
    const {
      access_secret,
      refresh_secret,
      accessTokenExpiration,
      refreshTokenExpiration,
    } = jwt;

    const accessToken = this.generateToken(
      userId,
      currentTime + accessTokenExpiration,
      TokenTypes.access,
      access_secret,
    );
    const refreshToken = this.generateToken(
      userId,
      currentTime + refreshTokenExpiration,
      TokenTypes.refresh,
      refresh_secret,
    );
    const accessExpDate = getTokenExpiration(accessTokenExpiration);
    const refreshExpDate = getTokenExpiration(refreshTokenExpiration);
    this.saveToken(accessToken, userId, accessExpDate, TokenTypes.access);
    this.saveToken(refreshToken, userId, refreshExpDate, TokenTypes.refresh);

    return {
      access: {
        token: accessToken,
        expires: new Date(accessExpDate).toISOString(),
      },
      refresh: {
        token: refreshToken,
        expires: new Date(refreshExpDate).toISOString(),
      },
    };
  }
}
