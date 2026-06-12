import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OrderProducer } from './order.producer';
import { OrderProcessor } from './order.processor';
import { OrdersModule } from '../orders/orders.module';
import { WebhookModule } from '../webhook/webhook.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const url =
          cs.get<string>('REDIS_URL') ?? cs.get<string>('REDIS_PUBLIC_URL');
        if (url) {
          try {
            const parsed = new URL(url);
            return {
              connection: {
                host: parsed.hostname,
                port: parseInt(parsed.port || '6379', 10),
                password: parsed.password || undefined,
                username: parsed.username || undefined,
              },
            };
          } catch {
            // fallback if URL is invalid
          }
        }
        return {
          connection: {
            host:
              cs.get<string>('REDIS_HOST') ??
              cs.get<string>('REDISHOST') ??
              'localhost',
            port:
              cs.get<number>('REDIS_PORT') ??
              cs.get<number>('REDISPORT') ??
              6379,
            password:
              (cs.get<string>('REDIS_PASSWORD') ??
                cs.get<string>('REDISPASSWORD')) ||
              undefined,
          },
        };
      },
    }),
    BullModule.registerQueue({
      name: 'order-processing',
    }),
    forwardRef(() => OrdersModule),
    WebhookModule,
  ],
  providers: [OrderProducer, OrderProcessor],
  exports: [OrderProducer],
})
export class QueueModule {}
