import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';
import { UserWithBalanceDto } from './dto/user-with-balance.dto';

@Injectable()
export class AdminService {
    constructor(private prisma: PrismaService, private wallet: WalletService){}

    async getUsersWithBalances(){
        const users = await this.prisma.user.findMany({
            where: { role: "USER" },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                createdAt: true
            }
        });

        const usersWithBalance: UserWithBalanceDto[] = [];

        for (const user of users) {
            const balanceData = await this.wallet.getBalance(user.id);
            
            usersWithBalance.push({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                balance: balanceData.balance, 
                createdAt: user.createdAt
            });
        }

        return usersWithBalance;
    }

    async getTransactions() {
        const transactions = this.prisma.ledgerEntry.findMany({
            select:{
                createdAt: true,
                type: true,
                referenceId: true,
                amount: true,
                user: { 
                    select: 
                    { 
                        firstName: true,
                        lastName: true,
                        email: true 
                    } 
                }
            },
            orderBy: {
                createdAt: 'desc' 
            }
        })

        return transactions
    }
}
