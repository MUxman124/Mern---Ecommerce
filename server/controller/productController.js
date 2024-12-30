import Product from "../models/Product.js";
import Review from "../models/Review.js";
import logger from "../config/logger.js";

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};


export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "user" } });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const totalRatings = product.reviews.reduce((total, review) => total + review.rating, 0);
  const averageRating = product.reviews.length > 0 ? totalRatings / product.reviews.length : 0;

  const productWithRating = {
    ...product.toObject(),
    averageRating: averageRating.toFixed(2),
    reviewCount: product.reviews.length,
  };

  res.json(productWithRating);
};

export const getProductsByFilter = async (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  const query = {};
  if (category) {
    query.category = category;
  }
  if (minPrice) {
    query.price = { $gte: minPrice };
  }
  if (maxPrice) {
    if (!query.price) {
      query.price = {};
    }
    query.price.$lte = maxPrice;
  }
  const products = await Product.find(query);
  res.json(products);
};

export const createProduct = async (req, res) => {
  const { name, description, price, imageUrl, category, stock } = req.body;
  const product = new Product({
    name,
    description,
    price,
    imageUrl,
    category,
    stock,
  });
  await product.save();
  res.status(201).json(product);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.json({ message: "Product removed" });
};
