import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { DatasourceService } from './datasource/datasource.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly orm: PrismaHealthIndicator,
    private readonly prisma: DatasourceService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    return this.health.check([
      () => this.orm.pingCheck('database', this.prisma),
      () => this.memory.checkRSS('mem_rss', 1024 * 2 ** 20 /** 1024 MB */),
    ]);
  }
}
