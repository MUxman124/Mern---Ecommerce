import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";

export function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCart(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch cart');
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) return;
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/cart',
                { productId, quantity },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchCart(); // Refresh cart after update
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update quantity');
        }
    };

    const removeItem = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/cart/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchCart(); // Refresh cart after removal
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove item');
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;
    if (!cart || cart.items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Card className="p-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-500 dark:text-gray-400">Start shopping to add items to your cart!</p>
                </Card>
            </div>
        );
    }

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
            <div className="space-y-4">
                {cart.items.map((item) => (
                    <Card key={item.product._id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img 
                                    src={item.product.imageUrl} 
                                    alt={item.product.name}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-semibold">{item.product.name}</h3>
                                    <p className="text-gray-500 dark:text-gray-400">${item.product.price}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <Input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.product._id, parseInt(e.target.value))}
                                    className="w-20"
                                />
                                <Button 
                                    variant="destructive"
                                    onClick={() => removeItem(item.product._id)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <Card className="mt-8 p-4">
                <div className="flex justify-between items-center">
                    <div className="text-xl font-bold">
                        Total: ${calculateTotal().toFixed(2)}
                    </div>
                    <Button size="lg">
                        Proceed to Checkout
                    </Button>
                </div>
            </Card>
        </div>
    );
}
