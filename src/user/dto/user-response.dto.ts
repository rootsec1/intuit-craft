import { Types } from 'mongoose';
import { Order } from 'src/order/model/order.schema';
import { User } from '../model/user.schema';

export class UserResponseDto {
  constructor(user: User) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user['createdAt'];
    this.updatedAt = user['updatedAt'];
    this.orders = user.orders as Order[];
  }

  _id: Types.ObjectId;

  name: string;

  email: string;

  createdAt: Date;

  updatedAt: Date;

  orders: Order[];
}
