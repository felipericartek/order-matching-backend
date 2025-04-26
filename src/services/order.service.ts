import { Request, Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Order } from '../entities/Order';
import { User } from '../entities/User';
import { emitUpdate } from '../socket/socket';

export const createOrder = async (req: any, res: Response) => {
    const { amount, price, type } = req.body;
    const userId = req.user.id;

    const userRepo = AppDataSource.getRepository(User);
    const orderRepo = AppDataSource.getRepository(Order);

    const user = await userRepo.findOneBy({ id: userId });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const order = orderRepo.create({
        amount,
        price,
        type,
        user,
    });

    await orderRepo.save(order);

    emitUpdate('new_order', { order });

    return res.status(201).json(order);
};

export const getMyOrders = async (req: any, res: Response) => {
    const userId = req.user.id;
    const orderRepo = AppDataSource.getRepository(Order);

    const orders = await orderRepo.find({
        where: { user: { id: userId }, status: 'ACTIVE' },
    });

    return res.json(orders);
};

export const getMyHistory = async (req: any, res: Response) => {
    const userId = req.user.id;
    const orderRepo = AppDataSource.getRepository(Order);

    const orders = await orderRepo.find({
        where: { user: { id: userId }, status: 'COMPLETED' },
    });

    return res.json(orders);
};

export const cancelOrder = async (req: any, res: Response) => {
    const userId = req.user.id;
    const orderId = parseInt(req.params.id);
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
};