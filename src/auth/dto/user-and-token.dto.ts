import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { User } from 'src/user/model/user.schema';

export class UserAndTokenDto {
  constructor(user: User, authToken: string) {
    this.user = new UserResponseDto(user);
    this.authToken = authToken;
  }

  user: UserResponseDto;

  authToken: string;
}
