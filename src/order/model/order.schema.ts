import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/model/user.schema';
import { OrderStatus } from '../enum/order-status.enum';
import { ProductQuantity } from './product-quantity.schema';

@Schema({ timestamps: true, versionKey: false })
export class Order extends Document {
  @Prop({ type: () => User, ref: 'User', required: true })
  user: Types.ObjectId | User;

  @Prop({ type: () => [ProductQuantity], required: true })
  products: ProductQuantity[];

  @Prop({
    type: () => Number,
    min: 1,
  })
  amount: number;

  @Prop({
    type: () => OrderStatus,
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
