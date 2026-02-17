import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      // Postgres (Neon)
      async () => {
        await this.prisma.$queryRaw`SELECT 1`;
        return { database: { status: 'up' } };
      },

      // Redis (Upstash)
      async () => {
        await this.redisService.healthCheck();
        return { redis: { status: 'up' as const } };
      },
    ]);
  }
}
