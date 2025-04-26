import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './controllers/auth.controller';
import orderRoutes from './controllers/order.controller';
import statisticsRoutes from './controllers/statistics.controller';
import { AppDataSource } from '../ormconfig';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/statistics', statisticsRoutes);

AppDataSource.initialize()
    .then(() => {
        console.log('✅ Banco de dados conectado com sucesso!');
    })
    .catch((error) => {
        console.error('❌ Erro na conexão com o banco de dados:', error);
    });

export default app;
