import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { ChatWebSocket } from 'src/utils/types';
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { Prisma, TokenTypes, UserRole } from '@prisma/client';
import { matchUserRoles } from 'src/auth/role/role.guard';
import {
  TokenVerificationService,
  verifyTokenErrs,
} from 'src/auth/token/token-verification.service';
import { UserInterface } from 'src/interfaces';

@Catch(WsException, HttpException)
export class WebsocketExceptionFilter extends BaseWsExceptionFilter {
  constructor(private eventName: string) {
    super();
  }
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient() as ChatWebSocket;
    const error = exception.getError();
    client.send(
      JSON.stringify({
        event: 'error',
        data: {
          event: this.eventName,
          error,
        },
      }),
    );
  }
}

@Injectable()
export class SocketAuthValidationPipe implements PipeTransform {
  tokenVerificationService: TokenVerificationService;
  constructor(
    private allowedRoles?: UserRole[],
    private userQuery?: {
      includeMerchantDetails?: boolean;
    },
  ) {
    this.tokenVerificationService = new TokenVerificationService();
  }
  async transform<T extends { token: string }>(
    value: T,
    metadata: ArgumentMetadata,
  ) {
    if (metadata.type !== 'body') return value;
    const userQuery: Prisma.TokenFindFirstArgs = {
      include: {
        user: true,
      },
    };
    if (this.userQuery?.includeMerchantDetails) {
      userQuery.include.user = {
        include: {
          merchantDetails: true,
        },
      };
    }

    const token = await this.tokenVerificationService.verifyToken(
      value?.token || '',
      TokenTypes.access,
      process.env.JWT_ACCESS_SECRET,
      verifyTokenErrs.ws,
      new WsException('Forbidden'),
      userQuery,
    );
    const user = token.user as UserInterface;
    if (
      this.allowedRoles &&
      !matchUserRoles(this.allowedRoles, user.userRoles)
    ) {
      throw new WsException('User does not have permission for the resource');
    }
    return {
      ...value,
      user,
    };
  }
}
