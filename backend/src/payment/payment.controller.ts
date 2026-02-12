import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentDto, WebhookDto } from './dto';
import { JwtGuard } from 'src/guard';
import { RolesGuard } from 'src/guard/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('payment') 
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @UseGuards(JwtGuard, RolesGuard)
    @Roles('USER')
    @Post('create') 
    createPayment(@Body() dto: PaymentDto, @Req() req: Request & { user: any }) {
        return this.paymentService.create(req.user.id, dto);
    }

    
    @UseGuards(JwtGuard, RolesGuard)
    @Roles('USER')
    @Post('webhook') 
    webhook(@Body() dto: WebhookDto, @Req() req: Request & { user: any }) {
        return this.paymentService.handleWebhook(req.user.id, dto);
    }

    
}
