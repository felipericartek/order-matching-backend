import { Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { Order, OrderStatus } from '../entities/Order';
import { User } from '../entities/User';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { amount, price, type } = req.body;
        const userId = req.user!.id;

        const userRepo = AppDataSource.getRepository(User);
        const orderRepo = AppDataSource.getRepository(Order);

        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const order = orderRepo.create({ amount, price, type, user });
        await orderRepo.save(order);

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMyOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const orderRepo = AppDataSource.getRepository(Order);

        const orders = await orderRepo.find({
            where: { user: { id: userId }, status: OrderStatus.ACTIVE },
            order: { createdAt: 'DESC' },
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching active orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getMyHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const orderRepo = AppDataSource.getRepository(Order);

        const orders = await orderRepo.find({
            where: { user: { id: userId }, status: OrderStatus.COMPLETED },
            order: { createdAt: 'DESC' },
        });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const cancelOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!.id;
        const orderId = parseInt(req.params.id, 10);
        const orderRepo = AppDataSource.getRepository(Order);

        const order = await orderRepo.findOne({
            where: { id: orderId, user: { id: userId }, status: OrderStatus.ACTIVE },
        });

        if (!order) {
            res.status(404).json({ message: 'Order not found or already completed/cancelled' });
            return;
        }

        order.status = OrderStatus.CANCELLED;
        await orderRepo.save(order);

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
