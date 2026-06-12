import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { QueueModule } from './queue/queue.module';
import { WebhookModule } from './webhook/webhook.module';
import { HealthController } from './health/health.controller';

import { User } from './users/entities/user.entity';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { WebhookLog } from './webhook/entities/webhook-log.entity';

import { JwtAccessGuard } from './auth/guards/jwt-access.guard';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        type: 'mysql',
        host:
          cs.get<string>('DB_HOST') ??
          cs.get<string>('MYSQLHOST') ??
          'localhost',
        port: cs.get<number>('DB_PORT') ?? cs.get<number>('MYSQLPORT') ?? 3306,
        username:
          cs.get<string>('DB_USERNAME') ??
          cs.get<string>('MYSQLUSER') ??
          'gemogi',
        password:
          cs.get<string>('DB_PASSWORD') ??
          cs.get<string>('MYSQLPASSWORD') ??
          'gemogi_password',
        database:
          cs.get<string>('DB_DATABASE') ??
          cs.get<string>('MYSQLDATABASE') ??
          'gemogi_db',
        entities: [User, Product, Order, WebhookLog],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    TerminusModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    QueueModule,
    WebhookModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
  ],
})
export class AppModule {}
