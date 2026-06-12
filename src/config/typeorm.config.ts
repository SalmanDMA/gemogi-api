import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { WebhookLog } from '../webhook/entities/webhook-log.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '3306', 10),
  username: process.env.DB_USERNAME ?? 'gemogi',
  password: process.env.DB_PASSWORD ?? 'gemogi_password',
  database: process.env.DB_DATABASE ?? 'gemogi_db',
  entities: [User, Product, Order, WebhookLog],
  migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
  synchronize: true,
};

export const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
