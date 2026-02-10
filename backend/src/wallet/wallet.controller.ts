import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtGuard } from 'src/guard';

@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService) {}

    @UseGuards(JwtGuard)
    @Get('balance')
    getBalance(@Req() req: Request & { user: any }) {
        const userId = req.user.id; 
        return this.walletService.getBalance(userId)

    }

    @UseGuards(JwtGuard)
    @Get('transactions')
    getTransactions(@Req() req: Request & { user: any }){
        const userId = req.user.id; 
        return this.walletService.getTransactions(userId)
    }
    
}
