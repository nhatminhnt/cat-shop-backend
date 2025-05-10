import { Request, Response } from "express";
import Order from "../models/order.model";
import User from "../models/user.model";
import { catchAsync } from "../utils/catchAsync";

export const getCustomerStats = catchAsync(
  async (req: Request, res: Response) => {
    // Lấy danh sách tất cả user
    const users = await User.find();

    // Lặp qua từng user để tính tổng đơn hàng & doanh thu
    const customerStats = await Promise.all(
      users.map(async (user) => {
        const orders = await Order.find({ user: user._id });

        const totalSpent = orders.reduce((acc, order) => +order.totalPrice, 0);
        const orderCount = orders.length;

        let type = "Mới";
        if (totalSpent > 10000000) type = "VIP";
        else if (totalSpent >= 5000000) type = "Thân thiết";

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          orderCount,
          totalSpent,
          type,
        };
      })
    );
    res.json(customerStats);
  }
);
