import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { RedisModule } from 'src/redis/redis.module';
import { WalletService } from 'src/wallet/wallet.service';
import { UserService } from 'src/user/user.service';
import { WalletModule } from 'src/wallet/wallet.module';
import { ElasticsearchModule } from 'src/elasticsearch/elasticsearch.module';

@Module({
    imports: [RedisModule, WalletModule, ElasticsearchModule],
    controllers: [TransferController],
    providers: [TransferService, UserService]
})
export class TransferModule {}
