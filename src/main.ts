import './dotenv.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as rateLimit from 'express-rate-limit';
import * as helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    rateLimit({
      windowMs: config.get<string>('RATE_LIMIT_WINDOW'),
      max: config.get<string>('RATE_LIMIT'),
    }),
  );
  app.enableCors();
  app.use(helmet());
  await app.listen(config.get<string>('PORT'), '0.0.0.0');
}
bootstrap();
