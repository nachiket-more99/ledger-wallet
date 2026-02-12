import { Controller, Get } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private admin: AdminService){}

    @Get('users')
    getUsers(){
        return this.admin.getUsersWithBalances()
    }

    @Get('transactions')
    getTransactions(){
        return this.admin.getTransactions()
    }
}
