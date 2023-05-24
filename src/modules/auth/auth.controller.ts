import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  registerUser(@Body() registerAuthDto: any) {
    return this.authService.registerUser(registerAuthDto);
  }

  @Post('/login')
  loginUser(@Body() loginAuthDto: any) {
    return this.authService.loginUser(loginAuthDto);
  }
}
