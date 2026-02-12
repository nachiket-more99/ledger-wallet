import { Controller, Get, UseGuards } from '@nestjs/common';
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
    getUsers(){
        return this.admin.getUsersWithBalances()
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('transactions')
    getTransactions(){
        return this.admin.getTransactions()
    }
}
