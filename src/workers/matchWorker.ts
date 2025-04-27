import { Worker } from 'bullmq';
import { matchOrders } from '../services/match.service';
import { redisOptions } from '../queues/redisConnection';

export const matchWorker = new Worker(
    'matchQueue',
    async (job) => {
        console.log('Processing match job:', job.id);
        await matchOrders();
    },
    {
        connection: redisOptions,
    }
);
