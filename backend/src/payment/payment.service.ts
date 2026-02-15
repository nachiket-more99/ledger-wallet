import { Injectable } from '@nestjs/common';
import { PaymentDto, WebhookDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LedgerType, PaymentStatusType, ReferenceType } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class PaymentService {
    constructor(private prisma: PrismaService, private redisService: RedisService){}

    async create(userId: string, dto: PaymentDto) {
        const payment = await this.prisma.payment.create({
            data: {
                provider: dto.provider,
                userId: userId,
                amount: Number(dto.amount),
                status: PaymentStatusType.CREATED
            },
            select: {
                providerOrderId: true,
                amount: true,
                status: true,
            },
        });

        return {
            "message": "payment created",
            providerOrderId: payment.providerOrderId,
            amount: payment.amount,
            status: payment.status,
        };
    }

    async handleWebhook(userId: string, dto: WebhookDto){
        const providerPaymentId = uuidv4()

        const payment = await this.prisma.payment.update({
            where: { providerOrderId: dto.providerOrderId },
            data: {
                providerPaymentId,
                status: PaymentStatusType.SUCCESS
            }
        })

        await this.prisma.ledgerEntry.create({
            data: {
                userId: userId,
                amount: payment.amount,
                type: LedgerType.CREDIT,
                referenceType: ReferenceType.PAYMENT,
                referenceId: payment.id
            }
        })

        
        // invalidate cache
        await this.redisService.delete(`wallet:balance:${userId}`);
        await this.redisService.delete(`wallet:transactions:${userId}:all`);
        await this.redisService.delete(`wallet:transactions:${userId}:${5}`);


        return {
            "message": "payment succeded",
            providerPaymentId: payment.providerPaymentId,
            amount: payment.amount,
            status: payment.status
        };

    }
}
