import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user.userId })
        .populate('items.product');
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }
    res.json(cart);
};

export const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock' });
    }

    let cart = await Cart.findOne({ user: req.user.userId });
    
    if (!cart) {
        cart = new Cart({
            user: req.user.userId,
            items: [{ product: productId, quantity }]
        });
    } else {
        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }
    }

    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
};

export const updateCartItem = async (req, res) => {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItem = cart.items.find(
        item => item.product.toString() === productId
    );
    if (!cartItem) {
        return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Check stock
    const product = await Product.findById(productId);
    if (product.stock < quantity) {
        return res.status(400).json({ message: 'Not enough stock' });
    }

    cartItem.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
};

export const removeFromCart = async (req, res) => {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user.userId });
    if (!cart) {
        return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
        item => item.product.toString() !== productId
    );
    
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
};
