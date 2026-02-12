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

    async delete(key: string){
        await this.redis.del(key)
    }

    async acquireLock(key: string, ttlSeconds = 5): Promise<boolean> {
        const acquired = await this.redis.setnx(key, 'locked');

        if (acquired === 1) {
            await this.redis.expire(key, ttlSeconds);
            return true;
        }

        return false;
    }

    async releaseLock(key: string) {
        await this.redis.del(key);
    }

    async onModuleDestroy() {
        await this.redis.quit()
    }
}
