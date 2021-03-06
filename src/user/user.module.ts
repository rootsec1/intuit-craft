import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as MongooseAutopopulate from 'mongoose-autopopulate';
import * as MongooseHistory from 'mongoose-history';
import { createConnection, Schema } from 'mongoose';
import { UserSchema } from './model/user.schema';
import { UserService } from './user.service';
import { ACTIVE_CONNECTION_NAME } from 'src/constants';
import { UserController } from './user.controller';

@Module({
  providers: [UserService],
  exports: [UserService],
  imports: [
    MongooseModule.forFeatureAsync(
      [
        {
          name: 'User',
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService): Schema => {
            const schema = UserSchema;
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
  controllers: [UserController],
})
export class UserModule {}
