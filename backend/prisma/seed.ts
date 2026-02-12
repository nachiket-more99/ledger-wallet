import { LedgerType, ReferenceType } from'@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';

const prisma = new PrismaService();

async function main() {
  const ledgerEntriesSeed = [
    // User 1 → total 1000
    {
      userId: '6cb5f9c2-8655-443c-a82a-07846d9a85af',
      amount: 400,
      type: LedgerType.CREDIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'u1-pay-001',
      createdAt: new Date('2026-02-01T10:00:00Z'),
    },
    {
      userId: '6cb5f9c2-8655-443c-a82a-07846d9a85af',
      amount: 600,
      type: LedgerType.CREDIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'u1-pay-002',
      createdAt: new Date('2026-02-02T12:00:00Z'),
    },

    // User 2 → total 500
    {
      userId: 'fd3a82de-5e05-458f-8648-0dc2eb8dbae5',
      amount: 200,
      type: LedgerType.CREDIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'u2-pay-001',
      createdAt: new Date('2026-02-03T09:00:00Z'),
    },
    {
      userId: 'fd3a82de-5e05-458f-8648-0dc2eb8dbae5',
      amount: 300,
      type: LedgerType.CREDIT,
      referenceType: ReferenceType.PAYMENT,
      referenceId: 'u2-pay-002',
      createdAt: new Date('2026-02-04T11:00:00Z'),
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
