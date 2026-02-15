import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { TransferDto } from './dto';
import { WalletService } from 'src/wallet/wallet.service';
import { UserService } from 'src/user/user.service';
import { LedgerType, ReferenceType, TransferStatusType } from '@prisma/client';

@Injectable()
export class TransferService {
    constructor(private prisma: PrismaService, private redisService: RedisService, private wallet: WalletService, private user: UserService){}

    async transfer(userId: string, dto: TransferDto){
        const lockKey = `wallet:lock:${userId}`

        const lockAcquired = await this.redisService.acquireLock(lockKey, 5);

        if (!lockAcquired) {
            throw new ForbiddenException('Wallet is busy, try again');
        }

        try {
            // get wallet balance
            const balance = await this.wallet.getBalance(userId)

            // check if balance < dto.amount
            if (Number(balance.balance) < Number(dto.amount)) 
                throw new ForbiddenException(
                    'Insufficient balance'
                )
                
            // check if recipient exisist recipientEmail => get id as toUserId
            const recipientUser = await this.user.getUserByEmail(dto.recipientEmail)
            
            if (!recipientUser) 
                throw new ForbiddenException(
                    'recipient does not exists'
                )

            // prevent self transfer
            if (recipientUser.id === userId) 
                throw new ForbiddenException('Cannot transfer to yourself');
                
                
            // create entry in Transfer table
            const transfer = await this.prisma.transfer.create({
                data: {
                    fromUserId: userId,
                    toUserId: recipientUser.id,
                    amount: Number(dto.amount),
                    status: TransferStatusType.SUCCESS
                }
            })
            
            // create entry in Ledger for DEBIT fromUserId
            await this.prisma.ledgerEntry.create({
                data: {
                    userId: userId,
                    amount: transfer.amount,
                    type: LedgerType.DEBIT,
                    referenceType: ReferenceType.TRANSFER,
                    referenceId: transfer.id
                }
            })

            // invalidate senders cache
            await this.redisService.delete(`wallet:balance:${userId}`);
            await this.redisService.delete(`wallet:transactions:${userId}:all`);
            await this.redisService.delete(`wallet:transactions:${userId}:${5}`);

            // create entry in Ledger for CREDIT toUSerId
            await this.prisma.ledgerEntry.create({
                data: {
                    userId: recipientUser.id,
                    amount: transfer.amount,
                    type: LedgerType.CREDIT,
                    referenceType: ReferenceType.TRANSFER,
                    referenceId: transfer.id
                }
            })
        
            // invalidate recievers cache
            await this.redisService.delete(`wallet:balance:${recipientUser.id}`);
            await this.redisService.delete(`wallet:transactions:${recipientUser.id}:all`);
            await this.redisService.delete(`wallet:transactions:${recipientUser.id}:${5}`);

            

            //return response        
            return {
                "message": "Money sent successfully",
                "firstName" : recipientUser.firstName,
                "lastName" : recipientUser.lastName,
                "recipientEmail": dto.recipientEmail,
                "amount": transfer.amount,
                "status": transfer.status,
            };
 
        }
        finally {
            // release lock
            await this.redisService.releaseLock(lockKey);
        }
    }
}
