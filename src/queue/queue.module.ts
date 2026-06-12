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
      useFactory: (cs: ConfigService) => ({
        connection: {
          host: cs.get<string>('REDIS_HOST') ?? 'localhost',
          port: cs.get<number>('REDIS_PORT') ?? 6379,
          password: cs.get<string>('REDIS_PASSWORD') || undefined,
        },
      }),
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
