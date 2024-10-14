import {
  Module,
  NestModule,
  MiddlewareConsumer,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { validateConfig } from '../config/config';
import { AuthModule } from 'src/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from 'src/cron/cron.module';
import { ItemEntitiesModule } from 'src/item-entities/item-entities.module';
import { UserEntitesModule } from 'src/user-entites/user-entites.module';
import { RequestStartTimeTracker } from 'src/middlewares/logger-startTime-tracker';
import { NestjsFormDataModule } from 'nestjs-form-data';
import prisma from 'src/prisma/client';
import { OrdersEntitiesModule } from 'src/orders-entities/orders-entities.module';
import { CommunicationModule } from 'src/communication/communication.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateConfig }),
    ScheduleModule.forRoot(),
    CommunicationModule,
    AuthModule,
    CronModule,
    ItemEntitiesModule,
    UserEntitesModule,
    NestjsFormDataModule,
    OrdersEntitiesModule,
  ],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule, OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await prisma.$connect();
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestStartTimeTracker).forRoutes('*');
  }
  async onModuleDestroy() {
    await prisma.$disconnect();
  }
}
