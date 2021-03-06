import { Types } from 'mongoose';

export class JwtPayloadDto {
  constructor(userId: Types.ObjectId) {
    this.userId = userId.toString();
  }

  userId: string;
}
