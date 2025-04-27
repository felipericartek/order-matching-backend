import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth.routes';
import orderRouter from './routes/order.routes';
import statisticsRouter from './routes/statistics.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/orders', orderRouter);
app.use('/api/statistics', statisticsRouter);

export default app;
