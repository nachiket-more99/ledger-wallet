import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { JwtGuard } from 'src/guard';
import { TransferDto } from './dto';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guard/roles.guard';

@Controller('transfer')
export class TransferController {
    constructor(private transferService: TransferService) {}

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('USER')
    @Post()
    sendMoney(@Body() dto: TransferDto, @Req() req: Request & { user: any }){
        return this.transferService.transfer(req.user.id, dto)
    }
}
