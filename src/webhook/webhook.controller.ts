import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { WebhookService } from './webhook.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('webhook')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Public()
  @Post('order-callback')
  @ApiOperation({
    summary: 'Receive outbound order webhook callback (internal)',
  })
  receiveCallback(@Body() body: Record<string, unknown>) {
    return this.webhookService.receiveCallback(body);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get webhook logs (admin debug)' })
  getLogs(@Query('orderId') orderId?: string) {
    return this.webhookService.getLogs(orderId);
  }
}
