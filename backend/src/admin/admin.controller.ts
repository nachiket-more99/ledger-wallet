import { Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('admin')
export class AdminController {
    constructor(private admin: AdminService){}

    // @UseGuards(JwtGuard, RolesGuard)
    // @Roles('ADMIN')
    // @Get('users')
    // getUsers(@Req() req: Request & { user: any }){
    //     return this.admin.getUsersWithBalances(req.user.id)
    // }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('users')
    getUsers(
    @Req() req: Request & { user: any },
    @Query('search') search = '',
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    ) {
    return this.admin.searchUsers(
        req.user.id,
        search,
        Math.max(1, Number(page) || 1),
        Math.min(100, Math.max(1, Number(limit) || 10)),
    );
    }

    // @UseGuards(JwtGuard, RolesGuard)
    // @Roles('ADMIN')
    // @Get('transactions')
    // getTransactions(@Req() req: Request & { user: any }, @Query('page') page?: string, @Query('limit') limit?: string,){
    //     return this.admin.getTransactions(req.user.id, page ? Number(page) : 1, limit ? Number(limit) : 8)
    // }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Get('transactions')
    getTransactions(
    @Req() req: Request & { user: any },
    @Query('search') search = '',
    @Query('page') page = '1',
    @Query('limit') limit = '8',
    @Query('filter') filter = 'ALL',
    ) {
        return this.admin.getTransactions(
            req.user.id,
            search,
            Math.max(1, Number(page) || 1),
            Math.min(100, Math.max(1, Number(limit) || 8)),
            filter,
        );
    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('reindex-search')
    reindexSearch() {
        return this.admin.reindexSearchIndexes();
    }
}
