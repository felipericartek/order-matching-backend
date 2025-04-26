import express from 'express';
import cors from 'cors';
import { AppDataSource } from '../ormconfig';
import authRoutes from './controllers/auth.controller';
import orderRoutes from './controllers/order.controller';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

AppDataSource.initialize().then(() => {
    console.log('Database connected!');
}).catch((error) => {
    console.error('Database connection error:', error);
});

export default app;
