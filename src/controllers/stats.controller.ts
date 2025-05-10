import { Request, Response } from "express";
import Order from "../models/order.model";
import { catchAsync } from "../utils/catchAsync";

// @desc Thống kê tổng doanh thu và đơn hàng
// @route GET /api/stats
export const getStats = catchAsync(async (req: Request, res: Response) => {
  const orders = await Order.find();

  const totalRevenue = orders.reduce(
    (acc, orders) => acc + orders.totalPrice,
    0
  );
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const canceledOrders = orders.filter((o) => o.status === "canceled").length;

  const totalCatsSold = orders.reduce((acc, order) => {
    return acc + order.orderItems.reduce((sum, item) => sum + item.quantity, 0);
  }, 0);

  res.json({
    totalRevenue,
    totalOrders,
    deliveredOrders,
    pendingOrders,
    canceledOrders,
    totalCatsSold,
  });
});

// @desc Thống kê doanh thu theo tháng
// @route GET /api/stats/monthly
export const getMonthlyRevenue = catchAsync(
  async (req: Request, res: Response) => {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalPrice" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const monthlyData = stats.map((item) => ({
      month: item._id,
      revenue: item.totalRevenue,
      orders: item.orderCount,
    }));

    res.json(monthlyData);
  }
);
