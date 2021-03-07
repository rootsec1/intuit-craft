import { User } from 'src/user/model/user.schema';

export class JwtPayloadDto {
  constructor(user: User) {
    this.user = user;
  }

  user: User;
}
