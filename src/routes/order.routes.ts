import express from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/order.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.route('/my')
  .get(protect, getMyOrders);

router.route('/:id/status')
  .put(protect, adminOnly, updateOrderStatus);

export default router;
