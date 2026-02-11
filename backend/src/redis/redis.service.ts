import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
    private redis: Redis;

    constructor(){
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379
        })
    }

    async get(key: string){
        return await this.redis.get(key)
    }

    async set(key: string, value: any, ttlSeconds = 60){
        return await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds)
    }

    async onModuleDestroy() {
        await this.redis.quit()
    }
}
