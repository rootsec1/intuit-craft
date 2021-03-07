import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { UserAndTokenDto } from './dto/user-and-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async createAuthToken(jwtPayload: JwtPayloadDto): Promise<string> {
    const user = await this.userService.getUserById(jwtPayload.user._id);
    return this.jwtService.sign(JSON.parse(JSON.stringify(user)));
  }

  async loginUser(email: string, password: string): Promise<UserAndTokenDto> {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) throw new UnauthorizedException('User does not exist');
      if (await compare(password, user.password)) {
        const payload: JwtPayloadDto = {
          user: user,
        };
        const authToken = await this.createAuthToken(payload);
        return new UserAndTokenDto(user, authToken);
      }
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
