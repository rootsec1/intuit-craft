import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createConnection, Schema } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongooseHistory from 'mongoose-history';
import { ACTIVE_CONNECTION_NAME, ORDERS_QUEUE_NAME } from 'src/constants';
import { ProductModule } from 'src/product/product.module';
import { UserModule } from 'src/user/user.module';
import { OrderSchema } from './model/order.schema';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  providers: [OrderService],
  controllers: [OrderController],
  imports: [
    UserModule,
    ConfigModule,
    ProductModule,
    MongooseModule.forFeatureAsync(
      [
        {
          name: 'Order',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService): Schema => {
            const schema = OrderSchema;
            schema.plugin(MongooseAutopopulate);
            schema.plugin(MongooseHistory, {
              historyConnection: createConnection(
                config.get<string>('HISTORY_MONGO_URL'),
                {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
                  useFindAndModify: true,
                  useCreateIndex: true,
                },
              ),
            });
            return schema;
          },
        },
      ],
      ACTIVE_CONNECTION_NAME,
    ),
    BullModule.registerQueue({
      name: ORDERS_QUEUE_NAME,
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 3,
      },
    }),
  ],
})
export class OrderModule {}
