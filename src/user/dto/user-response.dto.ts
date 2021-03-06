import { Types } from 'mongoose';
import { User } from '../model/user.schema';

export class UserResponseDto {
  constructor(user: User) {
    this._id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.createdAt = user['createdAt'];
    this.updatedAt = user['updatedAt'];
  }

  _id: Types.ObjectId;

  name: string;

  email: string;

  createdAt: Date;

  updatedAt: Date;
}
