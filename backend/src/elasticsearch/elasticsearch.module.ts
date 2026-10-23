import { Module } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { LedgerSearchService } from './ledger-search.service';

@Module({
  providers: [ElasticsearchService, LedgerSearchService],
  exports: [ElasticsearchService, LedgerSearchService],
})
export class ElasticsearchModule {}