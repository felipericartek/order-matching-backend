import { AppDataSource } from '../ormconfig';
import {Order, OrderStatus, OrderType} from '../entities/Order';
import { Match } from '../entities/Match';

export const matchOrders = async (): Promise<void> => {
    try {
        const orderRepo = AppDataSource.getRepository(Order);
        const matchRepo = AppDataSource.getRepository(Match);

        // @ts-ignore
        const buyOrders = await orderRepo.find({
            where: { status: OrderStatus.ACTIVE, type: OrderType.BUY },
            order: { price: 'DESC', createdAt: 'ASC' },
        });

        const sellOrders = await orderRepo.find({
            where: { status: OrderStatus.ACTIVE, type: OrderType.SELL },
            order: { price: 'ASC', createdAt: 'ASC' },
        });

        for (const buy of buyOrders) {
            for (const sell of sellOrders) {
                if (buy.price >= sell.price && buy.amount > 0 && sell.amount > 0) {
                    const matchedAmount = Math.min(buy.amount, sell.amount);

                    const match = matchRepo.create({
                        amount: matchedAmount,
                        price: sell.price,
                        buyerOrderId: buy.id,
                        sellerOrderId: sell.id,
                    });
                    await matchRepo.save(match);

                    buy.amount -= matchedAmount;
                    sell.amount -= matchedAmount;

                    if (buy.amount === 0) {
                        buy.status = OrderStatus.COMPLETED;
                    }
                    if (sell.amount === 0) {
                        sell.status = OrderStatus.COMPLETED;
                    }

                    await orderRepo.save([buy, sell]);
                }
            }
        }
    } catch (error) {
        console.error('Error matching orders:', error);
    }
};
