import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAccessGuard } from '../auth/guards/jwt-access.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAccessGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order (returns PENDING immediately)' })
  @ApiCreatedResponse({
    description: 'Order successfully created and queued for processing.',
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid product ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access token.' })
  @ApiNotFoundResponse({ description: 'Product not found or is inactive.' })
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: User) {
    return this.ordersService.create(dto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders for current user (paginated)' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (default: 20)',
  })
  @ApiOkResponse({
    description: 'Paginated list of orders retrieved successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access token.' })
  findAll(
    @CurrentUser() user: User,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.ordersService.findAllByUser(user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single order by ID for current user' })
  @ApiParam({ name: 'id', description: 'Order UUID', format: 'uuid' })
  @ApiOkResponse({ description: 'Order detail retrieved successfully.' })
  @ApiBadRequestResponse({ description: 'Invalid UUID format.' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access token.' })
  @ApiNotFoundResponse({ description: 'Order not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: User) {
    return this.ordersService.findOneByUser(id, user.id);
  }
}
