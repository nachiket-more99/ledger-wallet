
import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { WalletModule } from 'src/wallet/wallet.module';
import { RedisModule } from 'src/redis/redis.module';
import { ElasticsearchModule } from 'src/elasticsearch/elasticsearch.module';

@Module({
  imports: [WalletModule, RedisModule, ElasticsearchModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
