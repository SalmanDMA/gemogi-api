import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
  @ApiOkResponse({ description: 'Webhook callback processed successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid callback payload structure.' })
  receiveCallback(@Body() body: Record<string, unknown>) {
    return this.webhookService.receiveCallback(body);
  }

  @Get('logs')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get webhook logs (admin debug)' })
  @ApiQuery({
    name: 'orderId',
    required: false,
    type: String,
    description: 'Filter logs by Order UUID',
  })
  @ApiOkResponse({ description: 'Webhook logs retrieved successfully.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access token.' })
  getLogs(@Query('orderId') orderId?: string) {
    return this.webhookService.getLogs(orderId);
  }
}
