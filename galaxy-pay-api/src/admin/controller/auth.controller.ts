import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() authData) {
    return this.authService.login(authData);
  }
}
