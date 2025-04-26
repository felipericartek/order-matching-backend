import { Request, Response } from 'express';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../../ormconfig';

export const login = async (req: Request, res: Response) => {
    const { username } = req.body;
    const userRepo = AppDataSource.getRepository(User);

    let user = await userRepo.findOne({ where: { username } });

    if (!user) {
        user = userRepo.create({ username });
        await userRepo.save(user);
    }

    const token = jwt.sign({ id: user.id }, 'your-secret-key', { expiresIn: '7d' });

    res.json({ token });
};