import { Request, Response } from "express";
import Order from "../models/order.model";
import Cart from "../models/cart.model";
import Cat from "../models/cat.model";

export const createOrder = async (req: Request, res: Response) => {
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

  res.status(201).json(order);
};

export const getMyOrders = async (req: Request, res: Response) => {
  const orders = await Order.find({ user: req.user.id }).populate(
    "orderItems.cat"
  );
  res.json(orders);
};

export const getAllOrders = async (req: Request, res: Response) => {
  const orders = await Order.find().populate("user").populate("orderItems.cat");
  res.json(orders);
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Không tìm thấy Order" });
  }

  order.status = status;
  await order.save();
  res.json(order);
};
