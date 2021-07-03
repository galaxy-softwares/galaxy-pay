import { Controller, Post, Body } from '@nestjs/common'
import { LoginBody } from '../dtos/auth.dto'
import { AuthService } from '../service'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginBody: LoginBody) {
    return this.authService.login(loginBody)
  }
}
