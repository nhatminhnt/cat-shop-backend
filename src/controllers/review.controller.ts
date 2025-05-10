import { Request, Response } from "express";
import Review from "../models/review.model";
import Order from "../models/order.model";
import Cat from "../models/cat.model";
import { catchAsync } from "../utils/catchAsync";

// Người dùng đánh giá mèo
export const createReview = catchAsync(async (req: Request, res: Response) => {
  const { catId, rating, comment } = req.body;
  const userId = req.user._id;

  // Kiểm tra đã từng mua mèo chưa
  const orders = await Order.find({ user: userId, "orderItems.cat": catId });
  if (orders.length === 0) {
    return res
      .status(403)
      .json({ message: "Bạn cần mua mèo này mới được đánh giá" });
  }

  // Kiểm tra đã đánh giá chưa
  const existing = await Review.findOne({ user: userId, cat: catId });
  if (existing) {
    return res.status(400).json({ message: "Bạn đã đánh giá mèo này rồi" });
  }

  const review = new Review({ user: userId, cat: catId, rating, comment });
  await review.save();

  res.status(201).json({ message: "Đánh giá mèo thành công", review });
});

// Lấy đánh giá của một mèo
export const getReviewsForCat = catchAsync(
  async (req: Request, res: Response) => {
    const catId = req.params.catId;
    const reviews = await Review.find({ cat: catId }).populate("user", "name");

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

    res.json({ reviews, averageRating: avgRating.toFixed(1) });
  }
);
