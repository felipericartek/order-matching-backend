import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import {getStatistics} from "../services/statistics.service";

const router = Router();

router.use(authMiddleware);

router.get('/', getStatistics);

export default router;
