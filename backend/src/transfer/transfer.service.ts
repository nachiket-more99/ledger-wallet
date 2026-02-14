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
            console.log("fetched balance: ", balance)

            // check if balance < dto.amount
            if (Number(balance.balance) < Number(dto.amount)) 
                throw new ForbiddenException(
                    'Insufficient balance'
                )
            console.log("passed balance test")
                
            // check if recipent exisist recipientEmail => get id as toUserId
            const recipentUser = await this.user.getUserByEmail(dto.recipientEmail)
            
            if (!recipentUser) 
                throw new ForbiddenException(
                    'Recipent does not exists'
                )
            console.log("passed recipent email id test")

            // prevent self transfer
            if (recipentUser.id === userId) 
                throw new ForbiddenException('Cannot transfer to yourself');
                
                
            // create entry in Transfer table
            const transfer = await this.prisma.transfer.create({
                data: {
                    fromUserId: userId,
                    toUserId: recipentUser.id,
                    amount: Number(dto.amount),
                    status: TransferStatusType.SUCCESS
                }
            })
            console.log("transfer created")
            
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
            console.log("DEBIT created")
            // invalidate cache
            await this.redisService.delete(`wallet:balance:${userId}`);

            // create entry in Ledger for CREDIT toUSerId
            await this.prisma.ledgerEntry.create({
                data: {
                    userId: recipentUser.id,
                    amount: transfer.amount,
                    type: LedgerType.CREDIT,
                    referenceType: ReferenceType.TRANSFER,
                    referenceId: transfer.id
                }
            })
            console.log("CREDIT created")
            // invalidate cache
            await this.redisService.delete(`wallet:balance:${recipentUser.id}`);
            

            //return response        
            return {
                "message": "Money sent successfully",
                "firstName" : dto.firstName,
                "lastName" : dto.lastName,
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
