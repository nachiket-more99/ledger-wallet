import { Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    signup(){
        return this.authService.register()
    }
    @Post('login')
    signin(){
        return this.authService.login()
    }

}