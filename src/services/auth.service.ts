import { Request, Response } from 'express';
import { AppDataSource } from '../ormconfig';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username } = req.body;

        if (!username) {
            res.status(400).json({ message: 'Username is required' });
            return;
        }

        const userRepo = AppDataSource.getRepository(User);

        let user = await userRepo.findOneBy({ username });

        if (!user) {
            user = userRepo.create({ username });
            await userRepo.save(user);
        }

        const secretKey = process.env.JWT_SECRET || 'secret';
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '24h' });

        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
