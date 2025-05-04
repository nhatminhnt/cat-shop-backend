import { Request, Response } from "express";
import Cart from "../models/cart.model";
import Cat from "../models/cat.model";

export const addToCart = async (req: Request, res: Response) => {
  const { catId, quantity } = req.body;

  const cat = await Cat.findById(catId);
  if (!cat) {
    return res.status(404).json({ message: "Không tìm thấy mèo" });
  }

  let cart = await Cart.findOne({ user: req.user.id });

  if (cart) {
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.cat.toString() === catId
    );

    if (itemIndex > -1) {
      // Nếu có, cập nhật số lượng
      cart.cartItems[itemIndex].quantity += quantity;
    } else {
      // Nếu chưa, thêm mới
      cart.cartItems.push({ cat: catId, quantity });
    }

    await cart.save();
    res.json(cart);
  } else {
    // Tạo giỏ hàng mới
    const newCart = await Cart.create({
      user: req.user.id,
      cartItems: [{ cat: catId, quantity }],
    });

    res.status(201).json(newCart);
  }
};

export const getCart = async (req: Request, res: Response) => {
  const cart = await Cart.findOne({ user: req.user.id }).populate(
    "cartItems.cat"
  );

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  res.json(cart);
};

export const removeFromCart = async (req: Request, res: Response) => {
  const { catId } = req.params;
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.cartItems = cart.cartItems.filter(
    (item) => item.cat.toString() !== catId
  );
  await cart.save();
  res.json(cart);
};
