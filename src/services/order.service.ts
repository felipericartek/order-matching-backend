import { Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Order } from '../entities/Order';
import { User } from '../entities/User';
import { emitUpdate } from '../socket/socket';
import { tryMatchOrder } from './match.service';
import {AuthenticatedRequest} from "../middlewares/auth.middleware";
import { matchQueue } from '../queues/matchQueue';

export const createOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { amount, price, type } = req.body;
        const userId = req.user!.id;

        const userRepo = AppDataSource.getRepository(User);
        const orderRepo = AppDataSource.getRepository(Order);

        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const order = orderRepo.create({ amount, price, type, user });
        await orderRepo.save(order);

        await matchQueue.add('match-order', { orderId: order.id });

        emitUpdate('new_order', { order });

        return res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
