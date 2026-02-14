import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtGuard } from 'src/guard';
import { RolesGuard } from 'src/guard/roles.guard';

@Controller('user')
export class UserController {
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('USER')
  @Get('me')
  getMe(@Req() req: Request & { user: any }) {
    return {
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role
    }
  }
}
