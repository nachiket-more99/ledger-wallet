import { Injectable } from '@nestjs/common';
import { LedgerType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { TransactionDto } from './dto';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async getBalance(userIdValue: string) {
    const cacheKey = `wallet:balance:${userIdValue}`;

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        message: 'Balance fetched',
        source: 'cache',
        balance: JSON.parse(cached),
      };
    }

    // const result = await this.prisma.ledgerEntry.aggregate({
    //     where: {
    //         userId: userIdValue,
    //     },
    //     _sum: {
    //         amount: true,
    //     },
    // });

    const credit = await this.prisma.ledgerEntry.aggregate({
      where: {
        userId: userIdValue,
        type: LedgerType.CREDIT,
      },
      _sum: {
        amount: true,
      },
    });

    const debit = await this.prisma.ledgerEntry.aggregate({
      where: {
        userId: userIdValue,
        type: LedgerType.DEBIT,
      },
      _sum: {
        amount: true,
      },
    });

    const balance = (credit._sum.amount ?? 0) - (debit._sum.amount ?? 0);

    await this.redisService.set(cacheKey, balance, 30);

    return {
      message: 'Balance fetched',
      source: 'db',
      balance: balance,
    };
  }
  async getTransactions(userIdValue: string) {
    const cacheKey = `wallet:transactions:${userIdValue}`;

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        message: 'Transactions fetched',
        source: 'cache',
        transactions: JSON.parse(cached),
      };
    }

    // const transactions = await this.prisma.ledgerEntry.findMany({
    //     where:{
    //         userId: userIdValue
    //     },
    //     select:{
    //         amount: true,
    //         type: true,
    //         referenceType: true,
    //         createdAt: true
    //     },
    //     orderBy:{
    //         createdAt: 'desc'
    //     }
    // })

    const ledgerEntries = await this.prisma.ledgerEntry.findMany({
      where: { userId: userIdValue },
      orderBy: { createdAt: 'desc' },
    });

    const transactions: TransactionDto[] = [];

    for (const entry of ledgerEntries) {
      if (entry.referenceType === 'PAYMENT') {
        transactions.push({
          title: 'Added Money',
          date: entry.createdAt.toISOString(),
          amount: entry.amount,
          type: entry.type,
          direction: 'IN',
          referenceId: entry.referenceId,
        });
      }

      if (entry.referenceType === 'TRANSFER') {
        const transfer = await this.prisma.transfer.findUnique({
          where: { id: entry.referenceId },
        });

        if (!transfer) continue;

        const isSender = transfer.fromUserId === userIdValue;
        const otherUserId = isSender ? transfer.toUserId : transfer.fromUserId;

        const otherUser = await this.prisma.user.findUnique({
          where: { id: otherUserId },
          select: { firstName: true, lastName: true, email: true },
        });

        if (!otherUser) continue;

        transactions.push({
          title: isSender
            ? `Sent to ${otherUser.firstName} ${otherUser.lastName}`
            : `Received from ${otherUser.firstName} ${otherUser.lastName}`,
          date: entry.createdAt.toISOString(),
          amount: entry.amount,
          type: entry.type,
          direction: isSender ? 'OUT' : 'IN',
          referenceId: entry.referenceId,
        });
      }
    }

    await this.redisService.set(cacheKey, transactions, 60);

    return {
      message: 'Transactions fetched',
      source: 'db',
      transactions: transactions,
    };
  }
}
