import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';
import { UserWithBalanceDto } from './dto/user-with-balance.dto';
import { RedisService } from 'src/redis/redis.service';
import { ElasticsearchService } from 'src/elasticsearch/elasticsearch.service';
import type { estypes } from '@elastic/elasticsearch';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private wallet: WalletService,
    private redisService: RedisService,
    private elasticsearch: ElasticsearchService,
  ) {}

  async getUsersWithBalances(adminIdValue: string) {
    const cacheKey = `admin:users:${adminIdValue}`;

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        message: 'Users fetched',
        source: 'cache',
        users: JSON.parse(cached),
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

  // async getTransactions(
  //   adminIdValue: string,
  //   page: number = 1,
  //   limit: number = 8,
  // ) {
  //   const skip = (page - 1) * limit;
  //   const cacheKey = `admin:transactions:${adminIdValue}:${page}:${limit}`;

  //   const cached = await this.redisService.get(cacheKey);

  //   if (cached) {
  //     return {
  //       message: 'Transactions fetched',
  //       source: 'cache',
  //       result: JSON.parse(cached),
  //     };
  //   }
  //   const [transactions, total] = await Promise.all([
  //     this.prisma.ledgerEntry.findMany({
  //       select: {
  //         createdAt: true,
  //         type: true,
  //         referenceId: true,
  //         amount: true,
  //         user: {
  //           select: {
  //             firstName: true,
  //             lastName: true,
  //             email: true,
  //           },
  //         },
  //       },
  //       orderBy: {
  //         createdAt: 'desc',
  //       },
  //       skip,
  //       take: limit,
  //     }),
  //     this.prisma.ledgerEntry.count(),
  //   ]);

  //   const result = {
  //     transactions,
  //     page,
  //     limit,
  //     total,
  //     totalPages: Math.ceil(total / limit),
  //   };

  //   await this.redisService.set(cacheKey, result, 60);

  //   return {
  //     message: 'Transactions fetched',
  //     source: 'db',
  //     result,
  //   };
  // }
  
  

async getTransactions(
  adminId: string,
  search = '',
  page = 1,
  limit = 8,
  filter = 'ALL',
) {
  const normalizedSearch = search.trim();
  const requestedFilter = filter.trim().toUpperCase();

  const normalizedFilter =
    requestedFilter === 'PAYMENT' || requestedFilter === 'TRANSFER'
      ? requestedFilter
      : 'ALL';

  const cacheKey =
    `admin:transactions:search:${adminId}:` +
    `${normalizedSearch.toLowerCase()}:${normalizedFilter}:${page}:${limit}`;

  const cached = await this.redisService.get(cacheKey);

  if (cached) {
    return {
      message: 'Transactions fetched',
      source: 'cache',
      ...JSON.parse(cached),
    };
  }

  const client = this.elasticsearch.getClient();
  const must: estypes.QueryDslQueryContainer[] = [];

  if (normalizedSearch) {
    const normalizedType = normalizedSearch.toUpperCase();

    must.push({
      bool: {
        should: [
          {
            multi_match: {
              query: normalizedSearch,
              fields: ['firstName', 'lastName'],
              type: 'cross_fields',
              operator: 'and',
            },
          },
          {
            wildcard: {
              email: {
                value: `*${normalizedSearch.toLowerCase()}*`,
                case_insensitive: true,
              },
            },
          },
          {
            wildcard: {
              referenceId: {
                value: `*${normalizedSearch}*`,
                case_insensitive: true,
              },
            },
          },
          {
            term: {
              type: normalizedType,
            },
          },
        ],
        minimum_should_match: 1,
      },
    });
  }

  if (normalizedFilter !== 'ALL') {
    must.push({
      term: {
        referenceType: normalizedFilter,
      },
    });
  }

  const esQuery: estypes.QueryDslQueryContainer =
    must.length > 0
      ? { bool: { must } }
      : { match_all: {} };

  const response = await client.search<{ id: string }>({
    index: 'wallet-transactions',
    from: (page - 1) * limit,
    size: limit,
    query: esQuery,
    sort: [{ createdAt: { order: 'desc' } }],
  });

  const hits = response.hits.hits;

  const total =
    typeof response.hits.total === 'number'
      ? response.hits.total
      : (response.hits.total?.value ?? 0);

  const transactionIds = hits
    .map((hit) => hit._source?.id)
    .filter((id): id is string => Boolean(id));

  const dbTransactions = transactionIds.length
    ? await this.prisma.ledgerEntry.findMany({
        where: {
          id: { in: transactionIds },
        },
        select: {
          id: true,
          createdAt: true,
          type: true,
          referenceType: true,
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
      })
    : [];

  const transactionsById = new Map(
    dbTransactions.map((transaction) => [
      transaction.id,
      transaction,
    ]),
  );

  const transactions = transactionIds
    .map((id) => transactionsById.get(id))
    .filter((transaction) => transaction !== undefined)
    .map(({ id, ...transaction }) => transaction);

  const result = {
    transactions,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  await this.redisService.set(cacheKey, result, 30);

  return {
    message: 'Transactions fetched',
    source: 'elasticsearch',
    ...result,
  };
}

  
  async reindexSearchIndexes() {
    const client = this.elasticsearch.getClient();

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

    const userOperations = users.flatMap((user) => [
      {
        index: {
          _index: 'wallet-users',
          _id: user.id,
        },
      },
      user,
    ]);

    if (userOperations.length > 0) {
      await client.bulk({
        operations: userOperations,
        refresh: true,
      });
    }

    const transactions = await this.prisma.ledgerEntry.findMany({
      select: {
        id: true,
        userId: true,
        type: true,
        referenceId: true,
        referenceType: true,
        amount: true,
        createdAt: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    const transactionOperations = transactions.flatMap((transaction) => [
      {
        index: {
          _index: 'wallet-transactions',
          _id: transaction.id,
        },
      },
      {
        id: transaction.id,
        userId: transaction.userId,
        firstName: transaction.user.firstName,
        lastName: transaction.user.lastName,
        email: transaction.user.email,
        type: transaction.type,
        referenceId: transaction.referenceId,
        referenceType: transaction.referenceType,
        amount: transaction.amount,
        createdAt: transaction.createdAt,
      },
    ]);

    if (transactionOperations.length > 0) {
      await client.bulk({
        operations: transactionOperations,
        refresh: true,
      });
    }

    return {
      message: 'Search indexes populated',
      indexedUsers: users.length,
      indexedTransactions: transactions.length,
    };
  }
  
  async searchUsers(
    adminId: string,
    search: string,
    page = 1,
    limit = 10,
  ) {
    const normalizedSearch = search.trim();
    const cacheKey =
      `admin:users:search:${adminId}:${normalizedSearch.toLowerCase()}:${page}:${limit}`;

    const cached = await this.redisService.get(cacheKey);

    if (cached) {
      return {
        message: 'Users fetched',
        source: 'cache',
        ...JSON.parse(cached),
      };
    }

    const client = this.elasticsearch.getClient();

const esQuery: estypes.QueryDslQueryContainer = normalizedSearch
  ? {
      bool: {
        should: [
          {
            multi_match: {
              query: normalizedSearch,
              fields: ['firstName', 'lastName'],
              type: 'best_fields',
              operator: 'and',
            },
          },
          {
            wildcard: {
              email: {
                value: `*${normalizedSearch.toLowerCase()}*`,
                case_insensitive: true,
              },
            },
          },
        ],
        minimum_should_match: 1,
      },
    }
  : { match_all: {} };

    const response = await client.search<{
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      createdAt: string;
    }>({
      index: 'wallet-users',
      from: (page - 1) * limit,
      size: limit,
      query: esQuery,
      sort: [{ createdAt: { order: 'desc' } }],
    });

    const hits = response.hits.hits;
    const total =
      typeof response.hits.total === 'number'
        ? response.hits.total
        : (response.hits.total?.value ?? 0);

    const userIds = hits
      .map((hit) => hit._source?.id)
      .filter((id): id is string => Boolean(id));

    // Get current balances from PostgreSQL-backed services.
    const dbUsers = userIds.length
      ? await this.prisma.user.findMany({
          where: {
            id: { in: userIds },
            role: 'USER',
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          },
        })
      : [];

    const usersById = new Map(dbUsers.map((user) => [user.id, user]));

    const users = await Promise.all(
      userIds.map(async (id) => {
        const user = usersById.get(id);
        if (!user) return null;

        const balanceData = await this.wallet.getBalance(user.id);

        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          balance: balanceData.balance,
          createdAt: user.createdAt,
        };
      }),
    );

    const result = {
      users: users.filter((user) => user !== null),
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    await this.redisService.set(cacheKey, result, 30);

    return {
      message: 'Users fetched',
      source: 'elasticsearch',
      ...result,
    };
  }


}
