import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService, private redisService: RedisService){}
    
    async getBalance(userIdValue: string){
        const cacheKey = `wallet:balance:${userIdValue}`

        const cached = await this.redisService.get(cacheKey)

        if (cached){
            return {
                "message": 'Balance fetched',
                source: 'cache',
                balance: JSON.parse(cached),
            };
        }

        const result = await this.prisma.ledgerEntry.aggregate({
            where: {
                userId: userIdValue,
            },
            _sum: {
                amount: true,
            },
        });

        const balance = result._sum.amount ?? 0;

        await this.redisService.set(cacheKey, balance, 30)

        return {
            "message": 'Balance fetched',
            source: 'db',
            balance: balance
        }
    }
    async getTransactions(userIdValue: string){
        const cacheKey = `wallet:transactions:${userIdValue}`

        const cached = await this.redisService.get(cacheKey)

        if (cached) {
            return {
                "message": 'Transactions fetched',
                source: 'cache',
                transactions: JSON.parse(cached)
            }
        }

        const transactions = await this.prisma.ledgerEntry.findMany({
            where:{
                userId: userIdValue
            },
            orderBy:{
                createdAt: 'desc'
            }
        })

        await this.redisService.set(cacheKey, transactions, 60)

        return {
            "message": 'Transactions fetched',
            source: 'db',
            transactions: transactions
        }
    }    
}
