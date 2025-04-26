import { Router } from 'express';
import { createOrder, cancelOrder, getMyOrders, getMyHistory } from '../services/order.service';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/active', getMyOrders);
router.get('/history', getMyHistory);
router.delete('/:id', cancelOrder);

export default router;
