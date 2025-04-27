import { Response } from 'express';
import { AppDataSource } from '../../ormconfig';
import { Match } from '../entities/Match';
import { User } from '../entities/User';
import { MoreThanOrEqual } from 'typeorm';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getStatistics = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const matchRepo = AppDataSource.getRepository(Match);
        const userRepo = AppDataSource.getRepository(User);

        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const lastMatch = await matchRepo.findOne({
            order: { id: 'DESC' },
        });

        const lastPrice = lastMatch ? lastMatch.price : 0;

        const matches24h = await matchRepo.find({
            where: {
                createdAt: MoreThanOrEqual(last24h),
            },
        });

        const volumeBTC = matches24h.reduce((sum, match) => sum + match.amount, 0);
        const volumeUSD = matches24h.reduce((sum, match) => sum + match.amount * match.price, 0);

        const high = matches24h.length > 0 ? Math.max(...matches24h.map(m => m.price)) : 0;
        const low = matches24h.length > 0 ? Math.min(...matches24h.map(m => m.price)) : 0;

        const user = await userRepo.findOneBy({ id: req.user!.id });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.json({
            lastPrice,
            volumeBTC,
            volumeUSD,
            high,
            low,
            usdBalance: user.usdBalance,
            btcBalance: user.btcBalance,
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
