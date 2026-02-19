import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import compression from 'compression';
import helmet from 'helmet';
import type { HelmetOptions } from 'helmet';

import { AllExceptionsFilter, httpRequestLogger } from 'shared';

import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const ioAdapter = new IoAdapter(app);
  app.useWebSocketAdapter(ioAdapter);

  const config = app.get(ConfigService);

  const nodeEnv = config.get<string>('app.nodeEnv', 'development');
  const isProduction = nodeEnv === 'production';

  const helmetOptions: HelmetOptions = {
    contentSecurityPolicy: isProduction,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  };
  app.use(helmet(helmetOptions));
  app.use(compression());

  app.use(httpRequestLogger);

  const corsOrigin = config.get<string>('app.corsOrigin');
  app.enableCors({
    origin: corsOrigin,
    credentials: true,
  });

  const validationPipeOptions = new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
    transformOptions: {
      enableImplicitConversion: true,
    },
  });
  app.useGlobalPipes(validationPipeOptions);

  const allExceptionsFilter = new AllExceptionsFilter();
  app.useGlobalFilters(allExceptionsFilter);

  const apiPrefix = config.get<string>('app.apiPrefix', 'api');
  app.setGlobalPrefix(apiPrefix);

  const port = config.get<number>('app.port', 3001);
  await app.listen(port, '0.0.0.0');
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
