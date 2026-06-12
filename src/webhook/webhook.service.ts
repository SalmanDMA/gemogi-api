import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WebhookLog } from './entities/webhook-log.entity';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    @InjectRepository(WebhookLog)
    private readonly webhookLogRepo: Repository<WebhookLog>,
    private readonly configService: ConfigService,
  ) {}

  async sendCallbackSafe(order: Order | null): Promise<void> {
    if (!order) return;

    const callbackUrl = this.configService.get<string>('CALLBACK_URL');
    if (!callbackUrl) return;

    const payload = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      voucherCode: order.voucherCode ?? null,
      failureReason: order.failureReason ?? null,
      timestamp: new Date().toISOString(),
    };

    let statusCode: number | null = null;
    let error: string | null = null;

    try {
      const response = await axios.post(callbackUrl, payload, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' },
      });
      statusCode = response.status;
      this.logger.log(`Webhook sent for order ${order.id}: ${statusCode}`);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      error = errMsg;
      if (axios.isAxiosError(err)) {
        statusCode = err.response?.status ?? null;
      }
      this.logger.warn(`Webhook failed for order ${order.id}: ${errMsg}`);
    }

    await this.webhookLogRepo.save({
      orderId: order.id,
      payload,
      isOutbound: true,
      statusCode,
      error,
    });
  }

  async receiveCallback(
    body: Record<string, unknown>,
  ): Promise<{ received: boolean }> {
    this.logger.log(`Received webhook: ${JSON.stringify(body)}`);

    await this.webhookLogRepo.save({
      orderId: typeof body['orderId'] === 'string' ? body['orderId'] : null,
      payload: body,
      isOutbound: false,
      statusCode: 200,
      error: null,
    });

    return { received: true };
  }

  async getLogs(orderId?: string) {
    if (orderId) {
      return this.webhookLogRepo.find({
        where: { orderId },
        order: { receivedAt: 'DESC' },
      });
    }
    return this.webhookLogRepo.find({
      order: { receivedAt: 'DESC' },
      take: 50,
    });
  }
}
