import './dotenv.config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as rateLimit from 'express-rate-limit';
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
  await app.listen(config.get<string>('PORT'));
}
bootstrap();
