import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignIn_Dto } from './Dtos/SignIn-dto';
import { SignUp_Dto } from './Dtos/SignUp_dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async Register(@Body() body: SignUp_Dto) {
    const user = await this.authService.register(body);
    return user;
  }

  @Post('login')
  async login(@Body() body: SignIn_Dto) {
    const user = await this.authService.Login(body);
    return user;
  }
  @Post('refresh')
  async Refresh(@Body() body: { refreshToken: string }) {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh Token Not valid');
    }
    return this.authService.Refresh(body.refreshToken);
  }
}
