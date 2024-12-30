import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set) => ({
  cart: [],
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const cartProducts = response.data.items.map((item) => ({
        _id: item.product?._id,
        name: item.product?.name,
        price: item.product?.price,
        imageUrl: item.product?.imageUrl,
        category: item.product?.category,
        quantity: item.quantity,
      }));
      console.log(cartProducts)
      set({ cart: cartProducts, loading: false });
      set({ products: cartProducts, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || 'Failed to fetch products',
        loading: false,
      });
      console.log(err)
    }
  },

  addProductToCart: async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/cart',
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => {
        const productInCart = state.cart.find(
          (cartProduct) => cartProduct._id === productId
        );
        if (productInCart) {
          return {
            cart: state.cart.map((cartProduct) =>
              cartProduct._id === productId
                ? { ...cartProduct, quantity: cartProduct.quantity + quantity }
                : cartProduct
            ),
          };
        } else {
          const newProduct = state.products.find(
            (product) => product._id === productId
          );
          return {
            cart: [...state.cart, { ...newProduct, quantity }],
          };
        }
      });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to add to cart' });
    }
  },

  removeProductFromCart: async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/cart/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        cart: state.cart.filter((product) => product._id !== productId),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to remove from cart' });
    }
  },

  clearCart: () => set({ cart: [] }),

  updateProductQuantityInCart: async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/cart`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        cart: state.cart.map((product) =>
          product._id === productId ? { ...product, quantity } : product
        ),
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to update quantity' });
    }
  },
}));

export default useCartStore;