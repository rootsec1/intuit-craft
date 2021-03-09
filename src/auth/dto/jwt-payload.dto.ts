import { Types } from 'mongoose';

export class JwtPayloadDto {
  constructor(user: Types.ObjectId) {
    this.user = user;
  }

  user: Types.ObjectId;
}
