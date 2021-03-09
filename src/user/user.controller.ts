import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUserFromJWT } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreateUserInputDto } from './dto/create-user.input.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './model/user.schema';
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

  @Get('whoAmI')
  @UseGuards(JwtAuthGuard)
  async whoAmI(@CurrentUserFromJWT() user: User): Promise<UserResponseDto> {
    return new UserResponseDto(user);
  }
}
