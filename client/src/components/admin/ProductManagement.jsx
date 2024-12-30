import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { toast } from "react-toastify";
export function ProductManagement() {
  const navigate = useNavigate();
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
    } catch (err) {
      setError("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product is Deleted");

      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete product");
      toast.error("Failed to delete the product");
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
    <div className="">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Product Management</h2>
          <button
            className="p-1 px-2 font-[500] text-sm bg-lime-500 text-white"
            onClick={() => navigate("/admin/products/new")}
          >
            Add New Product
          </button>
        </div>

        <div className="grid gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="p-4 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{product.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      ${product.price} - Stock: {product.stock}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    variant="outline"
                    className="p-1 px-2 font-[500] text-sm bg-lime-500 text-white"
                    onClick={() =>
                      navigate(`/admin/products/edit/${product._id}`)
                    }
                  >
                    Edit
                  </button>
                  <button
                    className="p-1 px-2 font-[500] text-sm bg-red-500 text-white"
                    variant="destructive"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
