import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/products");
      setProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch products");
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/cart",
        { productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product added to cart!");
      toast.success("Product added to cart!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
      toast.error("Failed to add to cart!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <>
      <div className="">
        <h2 className="text-2xl font-bold mb-6">Our Products</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div key={product._id} className="relative bg-lime-100 rounded-lg shadow-lg group overflow-hidden">
              {/* Product Image */}
              <img
                alt={product.imageAlt}
                src={product.imageUrl}
                className="aspect-square w-full bg-gray-200 object-cover transition duration-500 group-hover:scale-105"
              />

              {/* Product Details */}
              <div className="p-4">
                <p className="text-sm text-gray-500">{product.color}</p>
                <h3 className="mt-1 font-semibold text-gray-900">
                  {product.name}
                </h3>
                <p className="mt-1 text-gray-900">${product.price}</p>
              </div>

              {/* Link Wrapper */}
              <Link
                to={`/product/${product._id}`}
                className="absolute inset-0"
              ></Link>
            </div>
          ))}
        </div>
      </div>
     
    </>
  );
}
