import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { $Enums, Prisma, TokenTypes } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { UserInterface } from 'src/interfaces';
import prisma from 'src/prisma/client';

export enum verifyTokenErrs {
  http = 'http',
  ws = 'ws',
}

@Injectable()
export class TokenVerificationService {
  async verifyToken(
    token: string,
    type: TokenTypes,
    secret: string,
    exceptionType: verifyTokenErrs = verifyTokenErrs.http,
    exception?: HttpException | WsException,
    additionalQuery?: Prisma.TokenFindFirstArgs,
  ) {
    const tokenPayload = jwt.verify(token, secret);

    const userToken: {
      token: string;
      id: number;
      type: $Enums.TokenTypes;
      userId: number;
      blackListed: boolean;
      expires: Date;
      user?: UserInterface;
    } = await prisma.token.findFirst({
      where: {
        token: token,
        type,
        userId: Number(tokenPayload.sub),
        blackListed: false,
      },
      ...additionalQuery,
    });

    if (exception && !userToken) {
      throw exception;
    }
    const tokenNotFoundMsg = 'Token not found';

    if (!userToken) {
      const error =
        exceptionType === verifyTokenErrs.ws
          ? new WsException(tokenNotFoundMsg)
          : new NotFoundException(tokenNotFoundMsg);
      throw error;
    }

    return userToken;
  }
}
