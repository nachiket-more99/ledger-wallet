import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { JwtGuard } from 'src/guard';

@Controller('wallet')
export class TransferController {
    constructor(private transferService: TransferService) {}

    
}
