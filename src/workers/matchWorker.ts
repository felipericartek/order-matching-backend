import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { AppDataSource } from '../../ormconfig';
import { Order } from '../entities/Order';
import { tryMatchOrder } from '../services/match.service';

const connection = new IORedis({
    host: 'localhost',
    port: 6379,
});

const worker = new Worker('matchQueue', async (job) => {
    const { orderId } = job.data;
    console.log(`🎯 Processando match para ordem: ${orderId}`);

    const orderRepo = AppDataSource.getRepository(Order);
    const order = await orderRepo.findOne({
        where: { id: orderId },
        relations: ['user'],
    });

    if (order) {
        await tryMatchOrder(order);
    } else {
        console.warn(`⚠️ Ordem não encontrada: ${orderId}`);
    }
}, { connection });

worker.on('completed', (job) => {
    console.log(`✅ Match processado para ordem: ${job.data.orderId}`);
});

worker.on('failed', (job, err) => {
    console.error(`❌ Erro ao processar match para ordem: ${job?.data?.orderId}`, err);
});
