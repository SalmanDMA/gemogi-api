import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { ProductsService } from '../products/products.service';
import { OrderProducer } from '../queue/order.producer';
import { User } from '../users/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly productsService: ProductsService,
    @Inject(forwardRef(() => OrderProducer))
    private readonly orderProducer: OrderProducer,
  ) {}

  async create(dto: CreateOrderDto, user: User): Promise<Order> {
    const product = await this.productsService.findById(dto.productId);
    if (!product || !product.isActive) {
      throw new NotFoundException('Product not found or inactive');
    }

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const order = this.orderRepo.create({
      orderNumber,
      userId: user.id,
      user,
      productId: product.id,
      product,
      productSnapshot: {
        name: product.name,
        category: product.category,
        provider: product.provider,
        denomination: product.denomination,
        imageUrl: product.imageUrl,
      },
      price: product.price,
      status: OrderStatus.PENDING,
    });

    const saved = await this.orderRepo.save(order);
    await this.orderProducer.enqueueProcessOrder(saved.id);

    return saved;
  }

  async findAllByUser(userId: string, page = 1, limit = 20) {
    const [items, total] = await this.orderRepo.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOneByUser(id: string, userId: string): Promise<Order> {
    const order = await this.orderRepo.findOne({ where: { id, userId } });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async findById(id: string): Promise<Order | null> {
    return this.orderRepo.findOne({ where: { id } });
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    extras?: { voucherCode?: string; failureReason?: string },
  ): Promise<Order> {
    const order = await this.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    Object.assign(order, { status, ...extras });
    return this.orderRepo.save(order);
  }
}
