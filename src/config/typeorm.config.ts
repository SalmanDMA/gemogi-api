import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { WebhookLog } from '../webhook/entities/webhook-log.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const url =
  process.env.DATABASE_URL ??
  process.env.MYSQL_URL ??
  process.env.MYSQL_PUBLIC_URL;

const dataSourceOptions: DataSourceOptions = url
  ? {
      type: 'mysql',
      url,
      entities: [User, Product, Order, WebhookLog],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      synchronize: true,
    }
  : {
      type: 'mysql',
      host: process.env.DB_HOST ?? process.env.MYSQLHOST ?? 'localhost',
      port: parseInt(
        process.env.DB_PORT ?? process.env.MYSQLPORT ?? '3306',
        10,
      ),
      username: process.env.DB_USERNAME ?? process.env.MYSQLUSER ?? 'gemogi',
      password:
        process.env.DB_PASSWORD ??
        process.env.MYSQLPASSWORD ??
        'gemogi_password',
      database:
        process.env.DB_DATABASE ?? process.env.MYSQLDATABASE ?? 'gemogi_db',
      entities: [User, Product, Order, WebhookLog],
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      synchronize: true,
    };

export const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
