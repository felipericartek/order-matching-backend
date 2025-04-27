import { Request, Response } from 'express';
import { User } from '../entities/User';
import jwt from 'jsonwebtoken';
import {AppDataSource} from "../../ormconfig";

export const login = async (req: Request, res: Response) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Username é obrigatório.' });
        }

        const userRepository = AppDataSource.getRepository(User);

        const user = await userRepository.findOneBy({ username });

        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        const secretKey = process.env.JWT_SECRET || 'secret';
        const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1d' });

        return res.json({ token });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};
