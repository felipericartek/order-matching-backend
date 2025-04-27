import express from 'express';
import cors from 'cors';
import { authMiddleware } from './middlewares/auth.middleware';
import { login } from './services/auth.service';
import {cancelOrder, createOrder, getMyHistory, getMyOrders} from "./services/order.service";
import {getStatistics} from "./services/statistics.service";

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/auth/login', login);

app.post('/api/orders', authMiddleware, createOrder);
app.get('/api/orders/active', authMiddleware, getMyOrders);
app.get('/api/orders/history', authMiddleware, getMyHistory);
app.delete('/api/orders/:id', authMiddleware, cancelOrder);
app.get('/api/statistics', authMiddleware, getStatistics);

export default app;
