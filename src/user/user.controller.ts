import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserInputDto } from './dto/create-user.input.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  async createUser(
    @Body() createUserInputDto: CreateUserInputDto,
  ): Promise<UserResponseDto> {
    return this.userService.createUser(createUserInputDto);
  }
}
