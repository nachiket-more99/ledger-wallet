import { LedgerType, ReferenceType } from'@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
  const ledgerEntriesSeed = [
    {
      userId: '25fc5598-3958-4166-ae88-a09003993eb3',
      amount: 1000,
      type: LedgerType.CREDIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'pay-001',
      createdAt: new Date('2026-02-01T10:00:00Z'),
    },
    {
      userId: '25fc5598-3958-4166-ae88-a09003993eb3',
      amount: -300,
      type: LedgerType.DEBIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'pay-002',
      createdAt: new Date('2026-02-02T14:15:00Z'),
    },
    {
      userId: '25fc5598-3958-4166-ae88-a09003993eb3',
      amount: 500,
      type: LedgerType.CREDIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'pay-003',
      createdAt: new Date('2026-02-03T09:30:00Z'),
    },
    {
      userId: '25fc5598-3958-4166-ae88-a09003993eb3',
      amount: -200,
      type: LedgerType.DEBIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'pay-004',
      createdAt: new Date('2026-02-04T11:45:00Z'),
    },
    {
      userId: '25fc5598-3958-4166-ae88-a09003993eb3',
      amount: 1200,
      type: LedgerType.CREDIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'pay-005',
      createdAt: new Date('2026-02-05T16:00:00Z'),
    },
  ];

  for (const entry of ledgerEntriesSeed) {
    await prisma.ledgerEntry.create({
      data: entry,
    });
  }

  console.log('Seeded ledger entries!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
