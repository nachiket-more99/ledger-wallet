import { Module } from '@nestjs/common';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { RedisModule } from 'src/redis/redis.module';

@Module({
    imports: [RedisModule],
    controllers: [WalletController],
    providers: [WalletService],
    exports: [WalletService]
})
export class WalletModule {}
