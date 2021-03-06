import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Order } from 'src/order/model/order.schema';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ type: () => String, required: true })
  name: string;

  @Prop({ type: () => String, required: true, unique: true })
  email: string;

  @Prop({ type: () => String, required: true })
  password: string;

  @Prop({
    type: () => [Types.ObjectId],
    ref: 'Order',
    autopopulate: true,
    default: [],
  })
  orders: Types.ObjectId[] | Order[];
}

export const UserSchema = SchemaFactory.createForClass(User);
