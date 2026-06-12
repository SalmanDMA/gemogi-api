import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class OrderProducer {
  constructor(
    @InjectQueue('order-processing')
    private readonly orderQueue: Queue,
  ) {}

  async enqueueProcessOrder(orderId: string): Promise<void> {
    await this.orderQueue.add(
      'process-order',
      { orderId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    );
  }
}
