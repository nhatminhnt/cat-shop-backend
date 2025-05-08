import { Request, Response } from "express";
import Order from "../models/order.model";
import Cart from "../models/cart.model";
import Cat from "../models/cat.model";
import { sendEmail } from "../utils/sendEmail";
import User from "../models/user.model";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("cartItems.cat");

    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    const totalPrice = cart.cartItems.reduce((acc, item) => {
      const price = (item.cat as any).price;
      return acc + item.quantity * price;
    }, 0);

    const order = await Order.create({
      user: userId,
      orderItems: cart.cartItems.map((item) => ({
        cat: item.cat,
        quantity: item.quantity,
      })),
      totalPrice,
    });

    // Xóa giỏ hàng sau khi đặt hàng
    await cart.deleteOne();

    // Lấy thông tin người dùng để gửi email
    const user = await User.findById(userId);

    if (user?.email) {
      await sendEmail(
        user.email,
        "🧾 Đơn hàng của bạn đã được xác nhận",
        `
          <h2>Cảm ơn bạn đã mua mèo tại MeoStore!</h2>
          <p>Tổng tiền: <strong>${totalPrice.toLocaleString()} VND</strong></p>
          <p>Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
        `
      );
    }

    res.status(201).json(order);
  } catch (error) {
    console.error("Lỗi khi tạo đơn hàng:", error);
    res.status(500).json({ message: "Lỗi máy chủ" });
  }
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "orderItems.cat"
    );
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy đơn hàng" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate("user")
      .populate("orderItems.cat");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Không thể lấy tất cả đơn hàng" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy Order" });
    }

    order.status = status;
    await order.save();

    const user = await User.findById(order.user);

    if (status === "delivered") {
      await sendEmail(
        user?.email || "",
        "🎉 Đơn hàng đã được giao",
        `
          <h2>Đơn hàng của bạn đã được giao thành công!</h2>
          <p>Cảm ơn bạn đã tin tưởng MeoStore!</p>
        `
      );
    } else if (status === "canceled") {
      await sendEmail(
        user?.email || "",
        "⚠️ Đơn hàng bị hủy",
        `
          <h2>Đơn hàng của bạn đã bị hủy</h2>
          <p>Chúng tôi xin lỗi vì sự bất tiện này. Nếu bạn có thắc mắc, vui lòng liên hệ với chúng tôi.</p>
        `
      );
    }

    res.json(order);
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
    res.status(500).json({ message: "Cập nhật trạng thái thất bại" });
  }
};
