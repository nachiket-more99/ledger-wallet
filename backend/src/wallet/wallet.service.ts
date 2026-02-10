import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class WalletService {
    constructor(private prisma: PrismaService){}
    
    async getBalance(userIdValue: string){
        const result = await this.prisma.ledgerEntry.aggregate({
            where: {
                userId: userIdValue,
            },
            _sum: {
                amount: true,
            },
        });

        const balance = result._sum.amount ?? 0;

        return {
            "message": 'Balance fetched',
            balance: balance
        }
    }
    async getTransactions(userIdValue: string){
        const transactions = await this.prisma.ledgerEntry.findMany({
            where:{
                userId: userIdValue
            },
            orderBy:{
                createdAt: 'desc'
            }
        })

        return {
            "message": 'Transactions fetched',
            transactions: transactions
        }
    }    
}
