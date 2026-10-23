
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private readonly client = new Client({
    node: process.env.ELASTICSEARCH_NODE ?? 'http://localhost:9200',
  });

  async onModuleInit() {
    await this.ensureIndex('wallet-users', {
      properties: {
        id: { type: 'keyword' },
        firstName: {
          type: 'text',
          fields: { keyword: { type: 'keyword' } },
        },
        lastName: {
          type: 'text',
          fields: { keyword: { type: 'keyword' } },
        },
        email: { type: 'keyword' },
        createdAt: { type: 'date' },
      },
    });

    await this.ensureIndex('wallet-transactions', {
      properties: {
        id: { type: 'keyword' },
        userId: { type: 'keyword' },
        firstName: { type: 'text' },
        lastName: { type: 'text' },
        email: { type: 'keyword' },
        type: { type: 'keyword' },
        referenceId: { type: 'keyword' },
        referenceType: { type: 'keyword' },
        amount: { type: 'integer' },
        createdAt: { type: 'date' },
      },
    });

    const health = await this.client.cluster.health();
    console.log('Elasticsearch connected:', health.status);
    console.log('Elasticsearch indexes initialized');
  }

  private async ensureIndex(
    index: string,
    mappings: Record<string, unknown>,
  ) {
    const exists = await this.client.indices.exists({ index });

    if (!exists) {
      await this.client.indices.create({
        index,
        mappings,
      });
    }
  }

  getClient() {
    return this.client;
  }
}
