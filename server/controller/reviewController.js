import Review from "../models/Review.js";
import Product from "../models/Product.js";

export const createReview = async (req, res) => {
  const { productId, rating, message } = req.body;

  if (!productId || !message || !rating) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const user = req.user.userId;
  const review = new Review({
    user,
    product: productId,
    rating,
    message,
  });

  await review.save();

  product.reviews.push(review._id);
  await product.save();

  res.status(201).json({
    message: "Review added successfully",
    review,
  });
};
