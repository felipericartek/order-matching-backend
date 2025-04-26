import { DataSource } from 'typeorm';
import { User } from './src/entities/User';
import { Order } from './src/entities/Order';
import { Match } from './src/entities/Match';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'order_matching',
  synchronize: true,
  logging: false,
  entities: [User, Order, Match],
});