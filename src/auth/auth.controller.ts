import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserAndTokenDto } from './dto/user-and-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async loginUser(
    @Query('email') email,
    @Query('password') password,
  ): Promise<UserAndTokenDto> {
    return this.authService.loginUser(email, password);
  }
}
