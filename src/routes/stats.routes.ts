import express from 'express';
import { getStats, getMonthlyRevenue } from '../controllers/stats.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';

const router = express.Router();

router.get('/', protect, adminOnly, getStats);
router.get('/monthly', protect, adminOnly, getMonthlyRevenue);

export default router;
