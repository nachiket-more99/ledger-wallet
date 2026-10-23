
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ElasticsearchService } from './elasticsearch.service';

@Injectable()
export class LedgerSearchService {
  private readonly logger = new Logger(LedgerSearchService.name);

  constructor(
    private prisma: PrismaService,
    private elasticsearch: ElasticsearchService,
  ) {}

  async indexLedgerEntry(ledgerEntryId: string): Promise<void> {
    try {
      const entry = await this.prisma.ledgerEntry.findUnique({
        where: { id: ledgerEntryId },
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

      if (!entry) return;

      await this.elasticsearch.getClient().index({
        index: 'wallet-transactions',
        id: entry.id,
        document: {
          id: entry.id,
          userId: entry.userId,
          firstName: entry.user.firstName,
          lastName: entry.user.lastName,
          email: entry.user.email,
          type: entry.type,
          referenceId: entry.referenceId,
          referenceType: entry.referenceType,
          amount: entry.amount,
          createdAt: entry.createdAt,
        },
      });
    } catch (error) {
      this.logger.error(
        `Failed to index ledger entry ${ledgerEntryId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }
}
