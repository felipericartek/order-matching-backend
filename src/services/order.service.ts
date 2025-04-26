import { Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Order } from '../entities/Order';
import { User } from '../entities/User';
import { emitUpdate } from '../socket/socket';
import { tryMatchOrder } from './match.service';
import {AuthenticatedRequest} from "../middlewares/auth.middleware";

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

        await tryMatchOrder(order);

        emitUpdate('new_order', { order });

        return res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const orderRepo = AppDataSource.getRepository(Order);

        const orders = await orderRepo.find({
            where: { user: { id: userId }, status: 'ACTIVE' },
        });

        return res.json(orders);
    } catch (error) {
        console.error('Error fetching active orders:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMyHistory = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const orderRepo = AppDataSource.getRepository(Order);

        const orders = await orderRepo.find({
            where: { user: { id: userId }, status: 'COMPLETED' },
        });

        return res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const cancelOrder = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user!.id;
        const orderId = parseInt(req.params.id, 10);
        const orderRepo = AppDataSource.getRepository(Order);

        const order = await orderRepo.findOne({
            where: { id: orderId, user: { id: userId }, status: 'ACTIVE' },
        });

        if (!order) {
            return res.status(404).json({ message: 'Order not found or already completed' });
        }

        order.status = 'CANCELLED';
        await orderRepo.save(order);

        emitUpdate('order_cancelled', { order });

        return res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
