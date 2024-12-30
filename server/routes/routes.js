import express from "express";
import { loginUser, registerUser } from "../controller/userController.js";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controller/cartController.js";
import { createReview } from "../controller/reviewController.js";
import { createPaymentIntent, confirmPayment } from "../controller/paymentController.js";
import { createOrder, getOrders } from "../controller/orderController.js";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import {asyncHandler} from "../utils/asyncHandler.js";

const router = express.Router();

// Auth routes
router.post("/login", asyncHandler(loginUser));
router.post("/register", asyncHandler(registerUser));

// Review routes
router.post("/review", auth, asyncHandler(createReview));

// Product routes
router.get("/products", asyncHandler(getProducts));
router.get("/products/:id", asyncHandler(getProduct));
router.post("/products", auth, adminAuth, asyncHandler(createProduct));
router.put("/products/:id", auth, adminAuth, asyncHandler(updateProduct));
router.delete("/products/:id", auth, adminAuth, asyncHandler(deleteProduct));

// Cart routes
router.get("/cart", auth, asyncHandler(getCart));
router.post("/cart", auth, asyncHandler(addToCart));
router.put("/cart", auth, asyncHandler(updateCartItem));
router.delete("/cart/:productId", auth, asyncHandler(removeFromCart));

// Payment routes
router.post("/create-payment-intent", auth, asyncHandler(createPaymentIntent));
router.post("/confirm-payment", auth, asyncHandler(confirmPayment));

// Order routes
router.post("/create-order", auth, asyncHandler(createOrder));
router.get("/orders", auth, asyncHandler(getOrders));

export default router;
