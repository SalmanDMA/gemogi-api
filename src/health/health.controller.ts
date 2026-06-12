import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  HealthCheck,
  HealthCheckError,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Public } from '../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import * as os from 'os';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    @InjectQueue('order-processing') private orderQueue: Queue,
  ) {}

  private formatDuration(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d ${h}h ${m}m ${s}s`;
  }

  private async checkRedis(): Promise<HealthIndicatorResult> {
    try {
      const client = await this.orderQueue.client;
      const pingResult = await (
        client as unknown as { ping(): Promise<string> }
      ).ping();
      if (pingResult === 'PONG') {
        return {
          redis: {
            status: 'up',
          },
        };
      }
      throw new Error(`Redis ping returned: ${pingResult}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      throw new HealthCheckError('Redis check failed', {
        redis: {
          status: 'down',
          message,
        },
      });
    }
  }

  @Public()
  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Get application health status and server specifications',
  })
  @ApiResponse({
    status: 200,
    description:
      'System health status and specifications retrieved successfully.',
  })
  @ApiResponse({
    status: 503,
    description: 'One or more services (database/redis) are unhealthy.',
  })
  async check() {
    const healthResult = await this.health.check([
      () => this.db.pingCheck('database'),
      () => this.checkRedis(),
    ]);

    return {
      ...healthResult,
      system: {
        nodeVersion: process.version,
        platform: os.platform(),
        arch: os.arch(),
        cpuModel: os.cpus()[0]?.model ?? 'Unknown',
        cpuCores: os.cpus().length,
        memory: {
          totalGb: (os.totalmem() / 1024 ** 3).toFixed(2) + ' GB',
          freeGb: (os.freemem() / 1024 ** 3).toFixed(2) + ' GB',
          processRssMb:
            (process.memoryUsage().rss / 1024 ** 2).toFixed(2) + ' MB',
        },
        uptime: {
          system: this.formatDuration(os.uptime()),
          process: this.formatDuration(process.uptime()),
        },
        environment: process.env.NODE_ENV ?? 'development',
      },
    };
  }
}
