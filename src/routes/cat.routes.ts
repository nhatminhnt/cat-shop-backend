import express from 'express';
import { getCats, createCat, updateCat, deleteCat } from '../controllers/cat.controller';
import { protect, adminOnly } from '../middlewares/auth.middleware';

const router = express.Router();

router.route('/')
  .get(getCats)                     // Ai cũng có thể xem danh sách mèo
  .post(protect, adminOnly, createCat); // Chỉ admin được tạo mèo

router.route('/:id')
  .put(protect, adminOnly, updateCat)   // Chỉ admin được sửa mèo
  .delete(protect, adminOnly, deleteCat); // Chỉ admin được xóa mèo

export default router;
