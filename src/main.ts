import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  RequestMethod,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './middlewares/all-exception.filter';
import { LoggingInterceptor } from './logger/logger.interceptor';
import { ValidationError } from 'class-validator';
import { processNestedValidationError } from './utils';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const configService = new ConfigService();
  const app = await NestFactory.create(AppModule, {
    cors: true,
    rawBody: true,
  });
  const config = new DocumentBuilder()
    .setTitle('Apnamart Api')
    .setDescription('Backend apis to work with front end')
    .setVersion('2.0')
    .addTag('Ecommerce')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const adapterHost = app.get(HttpAdapterHost);
  const port = configService.get('port');

  app.setGlobalPrefix('v2', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  app.use(helmet());
  app.use(compression());

  app.useWebSocketAdapter(new WsAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory(errors: ValidationError[]) {
        return new BadRequestException(processNestedValidationError(errors));
      },
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter(adapterHost));

  await app.listen(port, async () => {
    // This is for local testing only
    const enableNgRok = configService.get('ENABLE_NG_ROK') === 'true';
    if (!enableNgRok) return;
    const ngRok = require('@ngrok/ngrok');
    const builder = new ngRok.SessionBuilder();
    const session = await builder.authtokenFromEnv().connect();
    const listener = await session.httpEndpoint().listen();
    console.log('Ingress established at:', listener.url());
    const localHostUrl = `localhost:${port}`;
    listener.forward(localHostUrl);
  });
}

bootstrap();
