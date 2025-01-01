import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenService2 } from 'src/auth/token/token2.service';
import prisma from 'src/prisma/client';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(private tokenService: TokenService2) {}
  @Cron(CronExpression.EVERY_6_HOURS)
  async deleteExpiredTokens() {
    this.logger.log('Deleting all the expired tokens');
    await this.tokenService.deleteMany({
      expires: {
        lte: new Date(),
      },
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredCheckoutSessions() {
    this.logger.log('Deleting all the expired checkout sessions');
    const date = new Date();
    date.setDate(date.getDate() - 3);
    await prisma.checkoutSession.deleteMany({
      where: {
        updatedAt: {
          lt: date,
        },
      },
    });
  }
}
