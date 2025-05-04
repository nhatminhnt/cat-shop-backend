import express from 'express';
import { addToCart, getCart, removeFromCart } from '../controllers/cart.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .post(protect, addToCart)
  .get(protect, getCart);

router.route('/:catId')
  .delete(protect, removeFromCart);

export default router;
