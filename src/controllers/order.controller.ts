import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {cancelOrder, createOrder, getMyHistory, getMyOrders} from "../services/order.service";

const router = Router();

router.use(authMiddleware);

router.post('/', createOrder);
router.get('/active', getMyOrders);
router.get('/history', getMyHistory);
router.delete('/:id', cancelOrder);

export default router;
