import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepo.create(createProductDto);
    return this.productRepo.save(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    Object.assign(product, updateProductDto);
    return this.productRepo.save(product);
  }

  async findAll(query: QueryProductDto) {
    const { search, category, page = 1, limit = 12, includeInactive } = query;

    const qb = this.productRepo.createQueryBuilder('product');

    if (includeInactive !== 'true') {
      qb.where('product.isActive = :isActive', { isActive: true });
    }

    if (search) {
      if (includeInactive !== 'true') {
        qb.andWhere('product.name LIKE :search', { search: `%${search}%` });
      } else {
        qb.where('product.name LIKE :search', { search: `%${search}%` });
      }
    }
    if (category) {
      qb.andWhere('product.category = :category', { category });
    }

    const [items, total] = await qb
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id, isActive: true },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async findById(id: string): Promise<Product | null> {
    return this.productRepo.findOne({ where: { id } });
  }

  async count(): Promise<number> {
    return this.productRepo.count();
  }

  async seedProducts(products: Partial<Product>[]): Promise<void> {
    await this.productRepo.save(products);
  }
}
