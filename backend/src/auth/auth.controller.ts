import { Body, Controller, Post, Res } from '@nestjs/common'; // Use Res, not Req
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  async signin(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto);

    res.cookie('access_token', result.access_token, {
        httpOnly: true,
        secure: false,      
        sameSite: 'lax',    
        maxAge: 900000,
        path: '/',
    });

    return result;
  }

  @Post('logout')
  signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'User logged out' };
  }
}
