import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';
import { UserWithBalanceDto } from './dto/user-with-balance.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private redisService: RedisService,
  ) {}

  async getUsersWithBalances(adminIdValue: string) {
    const cacheKey = `admin:users:${adminIdValue}`;

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        message: 'Users fetched',
        source: 'cache',
        balance: JSON.parse(cached),
      };
    }
    const users = await this.prisma.user.findMany({
      where: { role: 'USER' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        createdAt: true,
      },
    });

    const usersWithBalance: UserWithBalanceDto[] = [];

    for (const user of users) {
      const balanceData = await this.wallet.getBalance(user.id);

      usersWithBalance.push({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        balance: balanceData.balance,
        createdAt: user.createdAt,
      });
    }

    await this.redisService.set(cacheKey, usersWithBalance, 30);

    return {
      message: 'Balance fetched',
      source: 'db',
      users: usersWithBalance,
    };
  }

  async getTransactions(
    adminIdValue: string,
    page: number = 1,
    limit: number = 8,
  ) {
    const skip = (page - 1) * limit;
    const cacheKey = `admin:transactions:${adminIdValue}:${page}:${limit}`;

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        message: 'Transactions fetched',
        source: 'cache',
        result: JSON.parse(cached),
      };
    }
    const [transactions, total] = await Promise.all([
      this.prisma.ledgerEntry.findMany({
        select: {
          createdAt: true,
          type: true,
          referenceId: true,
          amount: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.ledgerEntry.count(),
    ]);

    const result = {
      transactions,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    await this.redisService.set(cacheKey, result, 60);

    return {
      message: 'Transactions fetched',
      source: 'db',
      result,
    };
  }
}
