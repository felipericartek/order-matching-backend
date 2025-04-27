import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { cancelOrder, createOrder, getMyHistory, getMyOrders } from "../services/order.service";

const router = Router();

router.post('/', authMiddleware, createOrder);
router.get('/active', authMiddleware, getMyOrders);
router.get('/history', authMiddleware, getMyHistory);
router.delete('/:id', authMiddleware, cancelOrder);

export default router;
