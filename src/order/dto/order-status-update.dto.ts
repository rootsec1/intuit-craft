import { IsEnum } from 'class-validator';
import { Types } from 'mongoose';
import { OrderStatus } from '../enum/order-status.enum';

export class OrderStatusUpdateDto {
  orderId: Types.ObjectId;

  @IsEnum(OrderStatus)
  status: OrderStatus;
}
