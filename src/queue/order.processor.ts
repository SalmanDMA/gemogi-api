import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger, forwardRef } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrdersService } from '../orders/orders.service';
import { WebhookService } from '../webhook/webhook.service';
import { OrderStatus } from '../orders/enums/order-status.enum';
import { generateVoucherCode } from './voucher.util';

interface ProcessOrderJobData {
  orderId: string;
}

@Processor('order-processing')
export class OrderProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderProcessor.name);

  constructor(
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly webhookService: WebhookService,
  ) {
    super();
  }

  async process(job: Job<ProcessOrderJobData>): Promise<void> {
    if (job.name === 'process-order') {
      await this.handleProcessOrder(job);
    }
  }

  private async handleProcessOrder(
    job: Job<ProcessOrderJobData>,
  ): Promise<void> {
    const { orderId } = job.data;
    this.logger.log(
      `Processing order ${orderId} (attempt ${job.attemptsMade + 1})`,
    );

    try {
      await this.ordersService.updateStatus(orderId, OrderStatus.PROCESSING);
      const processingTime = 2000 + Math.floor(Math.random() * 2000);
      await new Promise((resolve) => setTimeout(resolve, processingTime));
      if (Math.random() < 0.1) {
        throw new Error('Provider temporarily unavailable');
      }
      const voucherCode = generateVoucherCode();
      const updatedOrder = await this.ordersService.updateStatus(
        orderId,
        OrderStatus.SUCCESS,
        { voucherCode },
      );
      this.logger.log(`Order ${orderId} completed — voucher: ${voucherCode}`);
      this.webhookService
        .sendCallbackSafe(updatedOrder)
        .catch((err: unknown) => {
          const errMsg = err instanceof Error ? err.message : String(err);
          this.logger.warn(
            `Webhook callback failed for order ${orderId}: ${errMsg}`,
          );
        });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Order ${orderId} failed: ${errMsg}`);
      if (job.attemptsMade + 1 >= (job.opts.attempts ?? 1)) {
        await this.ordersService.updateStatus(orderId, OrderStatus.FAILED, {
          failureReason: errMsg,
        });
        this.webhookService
          .sendCallbackSafe(await this.ordersService.findById(orderId))
          .catch(() => {});
      }
      throw error;
    }
  }
}
