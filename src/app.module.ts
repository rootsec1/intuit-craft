import * as Joi from '@hapi/joi';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ACTIVE_CONNECTION_NAME, HISTORY_CONNECTION_NAME } from './constants';
import { HealthModule } from './health/health.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .required()
          .valid('development', 'staging', 'production'),
        PORT: Joi.number().required(),
        RATE_LIMIT_WINDOW: Joi.number().required(),
        RATE_LIMIT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        API_KEY: Joi.string().required(),
        REDIS_HOST: Joi.string().required(),
        REDIS_PORT: Joi.number().required(),
      }),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      connectionName: ACTIVE_CONNECTION_NAME,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('HISTORY_MONGO_URL'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }),
      connectionName: HISTORY_CONNECTION_NAME,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        redis: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      }),
    }),
    AuthModule,
    ProductModule,
    OrderModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
