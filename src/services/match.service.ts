import { AppDataSource } from '../../ormconfig';
import { Order } from '../entities/Order';
import { User } from '../entities/User';
import { Match } from '../entities/Match';
import { emitUpdate } from '../socket/socket';

const MAKER_FEE = 0.005;
const TAKER_FEE = 0.003;

export const tryMatchOrder = async (newOrder: Order) => {
    const orderRepo = AppDataSource.getRepository(Order);
    const userRepo = AppDataSource.getRepository(User);
    const matchRepo = AppDataSource.getRepository(Match);

    const oppositeType = newOrder.type === 'BUY' ? 'SELL' : 'BUY';

    const matchingOrders = await orderRepo.find({
        where: { type: oppositeType, status: 'ACTIVE' },
        order: {
            price: newOrder.type === 'BUY' ? 'ASC' : 'DESC',
        },
        relations: ['user'],
    });

    for (const matchOrder of matchingOrders) {
        if ((newOrder.type === 'BUY' && newOrder.price >= matchOrder.price) ||
            (newOrder.type === 'SELL' && newOrder.price <= matchOrder.price)) {

            const tradePrice = matchOrder.price;
            const tradeAmount = Math.min(newOrder.amount, matchOrder.amount);

            const taker = await userRepo.findOneBy({ id: newOrder.user.id });
            const maker = await userRepo.findOneBy({ id: matchOrder.user.id });

            if (!taker || !maker) break;

            const makerFee = tradeAmount * MAKER_FEE;
            const takerFee = tradeAmount * TAKER_FEE;
            const netTradeAmount = tradeAmount - makerFee;

            const usdTotal = tradePrice * tradeAmount;

            if (newOrder.type === 'BUY') {
                taker.btcBalance += netTradeAmount;
                taker.usdBalance -= usdTotal;
                maker.usdBalance += usdTotal;
                maker.btcBalance -= tradeAmount;
            } else {
                taker.btcBalance -= tradeAmount;
                taker.usdBalance += usdTotal;
                maker.btcBalance += netTradeAmount;
                maker.usdBalance -= usdTotal;
            }

            newOrder.amount -= tradeAmount;
            matchOrder.amount -= tradeAmount;

            if (matchOrder.amount <= 0) {
                matchOrder.status = 'COMPLETED';
            }

            if (newOrder.amount <= 0) {
                newOrder.status = 'COMPLETED';
            }

            await userRepo.save([maker, taker]);
            await orderRepo.save([matchOrder, newOrder]);

            const newMatch = matchRepo.create({
                amount: tradeAmount,
                price: tradePrice,
            });
            await matchRepo.save(newMatch);

            emitUpdate('trade_executed', {
                price: tradePrice,
                amount: tradeAmount,
                type: newOrder.type,
            });

            if (newOrder.status === 'COMPLETED') {
                break;
            }
        } else {
            break;
        }
    }
};
