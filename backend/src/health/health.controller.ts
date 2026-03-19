import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { RedisService } from 'src/redis/redis.service';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private redisService: RedisService,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      // Redis (Upstash)
      async () => {
        await this.redisService.healthCheck();
        return { redis: { status: 'up' as const } };
      },
    ]);
  }
}