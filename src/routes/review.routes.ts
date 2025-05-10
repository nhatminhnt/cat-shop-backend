import express from 'express';
import { createReview, getReviewsForCat } from '../controllers/review.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', protect, createReview); // gửi đánh giá
router.get('/:catId', getReviewsForCat); // lấy đánh giá theo mèo

export default router;
