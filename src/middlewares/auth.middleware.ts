import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
}

interface AuthenticatedRequest extends Request {
    user?: {
        id: number;
    };
}

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ message: 'Token missing' });
        return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        res.status(401).json({ message: 'Token mal formatado' });
        return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        res.status(401).json({ message: 'Token mal formatado' });
        return;
    }

    try {
        const secretKey = process.env.JWT_SECRET || 'your-secret-key';
        const decoded = jwt.verify(token, secretKey) as JwtPayload;

        req.user = { id: decoded.id };

        next();
    } catch (error) {
        console.error('JWT verification failed:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
