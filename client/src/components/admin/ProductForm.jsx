import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useNavigate, useParams } from 'react-router-dom';

export function ProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: '',
        stock: 0
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            if (isEditing) {
                await axios.put(`http://localhost:5000/products/${id}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/products', formData, config);
            }

            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save product');
            console.log("the error is ==", err)
        } finally {
            setLoading(false);
        }
    };

    const getProductById = async (id) => {
        try {
            const response = await axios.get(`http://localhost:5000/products/${id}`);
            setFormData(response.data);
        } catch (err) {
            setError('Failed to fetch product');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? Number(value) : value
        }));
    };

    useEffect(() => {
        if (id) {
            getProductById(id);
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [id]);

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto shadow-lg">
                <CardHeader className="bg-gray-50 border-b border-gray-200 py-4">
                    <CardTitle className="text-2xl font-semibold text-gray-800">
                        {isEditing ? 'Edit Product' : 'Add New Product'}
                    </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    {error && (
                        <div className="flex items-center bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <Input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Product name"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <Input
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    placeholder="Product category"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                placeholder="Product description"
                                className="w-full min-h-[120px] p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                <Input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                                <Input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    placeholder="0"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                                <Input
                                    name="imageUrl"
                                    value={formData.imageUrl}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://example.com/image.jpg"
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/products')}
                                className="w-full md:w-auto"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto"
                            >
                                {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}