import { Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Order } from '../entities/Order';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { emitUpdate } from '../socket/socket';
import { matchQueue } from '../queues/matchQueue';

// Criar nova ordem
export const createOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { amount, price, type } = req.body;
        const userId = req.user!.id;

        const userRepo = AppDataSource.getRepository('User');
        const orderRepo = AppDataSource.getRepository(Order);

        const user = await userRepo.findOneBy({ id: userId });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const order = orderRepo.create({ amount, price, type, user });
        await orderRepo.save(order);

        await matchQueue.add('match-order', { orderId: order.id });

        emitUpdate('new_order', { order });

        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Listar ordens ativas
export const getMyOrders = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const orderRepo = AppDataSource.getRepository(Order);
        const orders = await orderRepo.find({
            where: { user: { id: req.user!.id }, status: 'ACTIVE' },
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching active orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Listar histórico de ordens completadas
export const getMyHistory = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const orderRepo = AppDataSource.getRepository(Order);
        const orders = await orderRepo.find({
            where: { user: { id: req.user!.id }, status: 'COMPLETED' },
        });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching order history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Cancelar ordem
export const cancelOrder = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const orderId = parseInt(req.params.id);
        const userId = req.user!.id;

        const orderRepo = AppDataSource.getRepository(Order);

        const order = await orderRepo.findOne({
            where: { id: orderId, user: { id: userId }, status: 'ACTIVE' },
        });

        if (!order) {
            res.status(404).json({ message: 'Order not found or already completed' });
            return;
        }

        order.status = 'CANCELLED';
        await orderRepo.save(order);

        emitUpdate('order_cancelled', { order });

        res.json({ message: 'Order cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
