import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createConnection, Schema } from 'mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongooseHistory from 'mongoose-history';
import { ACTIVE_CONNECTION_NAME } from 'src/constants';
import { ProductSchema } from './model/product.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
  imports: [
    ConfigModule,
    CacheModule.register(),
    MongooseModule.forFeatureAsync(
      [
        {
          name: 'Product',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService): Schema => {
            const schema = ProductSchema;
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
  ],
})
export class ProductModule {}
