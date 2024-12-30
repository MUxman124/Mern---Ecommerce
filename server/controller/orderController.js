import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
export const createOrder = async (req, res) => {
  const user = req.user.userId;
  const order = await Order.create({ user, ...req.body });

  const cart = await Cart.findOne({ user });

  if (cart) {
    cart.items = [];
    await cart.save();
  }
  res.status(201).json({ success: true, message: "Order created successfully", order });
};

export const getOrders = async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
};
