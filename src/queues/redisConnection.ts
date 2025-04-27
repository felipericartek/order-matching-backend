import { RedisOptions } from 'bullmq';

export const redisOptions: RedisOptions = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
};
