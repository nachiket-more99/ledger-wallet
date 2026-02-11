import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [TransferController],
    providers: [TransferService]
})
export class TransferModule {}
