import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { Order } from './entities/Order';
import { Match } from './entities/Match';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: [User, Order, Match],
});
