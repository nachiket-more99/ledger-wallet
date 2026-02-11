import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TransferService {
    constructor(private prisma: PrismaService, private redisService: RedisService){}
    
}
