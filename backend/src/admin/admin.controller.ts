import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
    constructor(private admin: AdminService){}

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('users')
    getUsers(@Req() req: Request & { user: any }){
        return this.admin.getUsersWithBalances(req.user.id)
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('transactions')
    getTransactions(@Req() req: Request & { user: any }, @Query('page') page?: string, @Query('limit') limit?: string,){
        return this.admin.getTransactions(req.user.id, page ? Number(page) : 1, limit ? Number(limit) : 8)
    }
}
