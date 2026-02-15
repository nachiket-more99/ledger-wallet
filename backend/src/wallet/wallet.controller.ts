import { Controller, Get, Req, UseGuards, Query } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtGuard } from 'src/guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('USER')
    @Get('balance')
    getBalance(@Req() req: Request & { user: any }) {
        const userId = req.user.id; 
        return this.walletService.getBalance(userId)

    }

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('USER')
    @Get('transactions')
    getTransactions(@Req() req: Request & { user: any }, @Query('limit') limit?: string) {
        return this.walletService.getTransactions(req.user.id, limit ? Number(limit) : undefined,);
    }
    
}
