import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RedisModule } from 'src/redis/redis.module';
import { ElasticsearchModule } from 'src/elasticsearch/elasticsearch.module';

@Module({
    imports: [RedisModule, ElasticsearchModule],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}
