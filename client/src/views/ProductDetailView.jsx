import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  GlobeAltIcon,
  TruckIcon,
  LockClosedIcon,
  CheckIcon,
  StarIcon,
} from "@heroicons/react/20/solid";
import { toast } from "react-toastify";
import useCartStore from "../store/ecomStore";
import axios from "axios";
const ProductDetailView = () => {
  const { id } = useParams();
  const { addProductToCart, error } = useCartStore();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState("");

  const [reviewData, setReviewData] = useState({
    message: "",
    rating: 5,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        setErrors("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCart = async (productId) => {
    try {
      await addProductToCart(product, quantity);
      if (error) {
        toast.error(error);
      }
    } catch (err) {
      console.log(err, "dddsdsd");
      setErrors(err.response?.data?.message || "Failed to add to cart");
      toast.error("Failed to add to cart!");
    }
  };

  const handleAddReview = async () => {
    if (!reviewData.message || reviewData.rating === 0) {
      return toast.error("Please enter a valid review");
    }
    try {
      const token = localStorage.getItem("token");
      const data = {
        message: reviewData?.message,
        rating: reviewData?.rating,
        productId: id,
      };
      const response = await axios.post(`http://localhost:5000/review`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      toast.success("Review added successfully!");
      setReviewData({ message: "", rating: 0 });
    } catch (err) {
      toast.error("Failed to add review!");
      console.log(err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading...
      </div>
    );
  if (errors)
    return <div className="text-red-500 text-center mt-10">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      {product && (
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Product Image Section */}
          <div className="lg:w-1/2">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="rounded-lg shadow-lg object-cover w-full max-h-96"
            />
          </div>

          {/* Product Details Section */}
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-lg text-gray-700">{product.description}</p>
            <div className="flex items-center space-x-1">
              {[
                ...Array(
                  Math.floor(
                    product.reviews.reduce(
                      (acc, current) => acc + current.rating,
                      0
                    ) / product.reviews.length || 0
                  )
                ),
              ].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
              ))}
              {[
                ...Array(
                  5 -
                    Math.floor(
                      product.reviews.reduce(
                        (acc, current) => acc + current.rating,
                        0
                      ) / product.reviews.length || 0
                    )
                ),
              ].map((_, i) => (
                <StarIcon key={i} className="h-5 w-5 text-gray-300" />
              ))}
              <p className="text-sm text-gray-700">
                {Math.floor(
                  product.reviews.reduce(
                    (acc, current) => acc + current.rating,
                    0
                  ) / product.reviews.length || 0
                )}{" "}
                out of 5 stars
              </p>
            </div>

            <p className="text-xl font-semibold text-gray-900">
              Price: <span className="text-lime-500">${product.price}</span> |
              Category:{" "}
              <span className="font-medium text-gray-800">
                {product.category}
              </span>
            </p>

            <div className="flex items-center space-x-4">
              <span class="relative flex h-3 w-3">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="">In stock, ready to Ship</span>
            </div>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="quantity"
                className="text-lg font-medium text-gray-700"
              >
                Quantity:
              </label>
              <div className="flex items-center border border-gray-100  overflow-hidden">
                <button
                  type="button"
                  className=" px-3 py-2 hover:bg-gray-100 text-lime-500 font-bold"
                  onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                >
                  -
                </button>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="px-1 py-2 text-center"
                />
                <button
                  type="button"
                  className=" px-3 py-2 hover:bg-gray-100 text-lime-500 font-bold"
                  onClick={() =>
                    setQuantity(Math.min(quantity + 1, product.stock))
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-6">
              <button
                className="bg-black w-full text-white font-semibold py-3 shadow hover:bg-gray-900 transition duration-300"
                onClick={() => addToCart(product._id)}
              >
                Add to Cart
              </button>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <GlobeAltIcon className="h-6 w-6" />
              <span className="font-medium text-gray-800">
                Free worldwide shipping
              </span>
            </div>
            <div className="flex items-center space-x-4 mb-3">
              <TruckIcon className="h-6 w-6" />
              <span className="font-medium text-gray-800">Free returns</span>
            </div>
            <div className="flex items-center space-x-4 mb-3">
              <CheckIcon className="h-6 w-6" />
              <span className="font-medium text-gray-800">Carbon neutral</span>
            </div>
            <div className="flex items-center space-x-4">
              <LockClosedIcon className="h-6 w-6 " />
              <span className="font-medium text-gray-800">Secure payments</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          Reviews
        </h2>

        <div className="my-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {product?.reviews?.map((review) => (
            <div key={review._id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {review.user.name}{" "}
                    <span className="text-sm text-gray-600">
                      - Verified User{" "}
                    </span>
                  </h3>
                  <p className="text-sm text-gray-600">{review.title}</p>
                  <p className="text-sm text-gray-600">{review.message}</p>
                  <div className="flex items-center space-x-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Review Section */}
      <div className="p-4 mx-auto bg-white rounded-lg shadow-md max-w-4xl sm:p-6 grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-4 col-span-1">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Write a review
            </h2>

            {/* Star Rating Section */}
            <div className="flex justify-start items-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star, i) => (
                <div key={star}>
                  <input
                    type="radio"
                    id={`${star}-stars`}
                    name="rating"
                    value={star}
                    checked={reviewData.rating === star}
                    onChange={(e) =>
                      setReviewData({
                        ...reviewData,
                        rating: parseInt(e.target.value),
                      })
                    }
                    className="hidden"
                  />
                  <label
                    htmlFor={`${star}-stars`}
                    className={
                      star <= reviewData.rating
                        ? "text-yellow-400 text-2xl cursor-pointer hover:scale-110"
                        : "text-gray-400 text-2xl cursor-pointer hover:scale-110"
                    }
                  >
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        star <= reviewData.rating
                          ? "text-yellow-400"
                          : "text-gray-400"
                      }`}
                    />
                  </label>
                </div>
              ))}
            </div>

            {/* Review Text Area */}
            <textarea
              id="review"
              name="review"
              rows="4"
              value={reviewData.message}
              onChange={(e) =>
                setReviewData({
                  ...reviewData,
                  message: e.target.value,
                })
              }
              required
              className="block w-full p-3 text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your review"
            />

            {/* Submit Button */}
            <div className="text-right py-4">
              <button
                onClick={handleAddReview}
                className="text-white bg-lime-600 hover:bg-lime-700 focus:ring-4 focus:outline-none focus:ring-lime-300 font-semibold text-sm px-5 py-3"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>

        {/* Rating Statistics Section */}
        <div className="lg:col-span-2 hidden lg:flex flex-col space-y-4">
          <div className="flex items-center">
            <span className="text-yellow-400 text-xl">★★★★★</span>
            <p className="ml-2 text-sm font-medium text-gray-900">
              {product.reviews ? product.reviews.length : 0} out of{" "}
              {product.reviews ? product.reviews.length : 0}
            </p>
          </div>
          <p className="text-sm font-medium text-gray-500">
            {product.reviews ? product.reviews.length : 0} global ratings
          </p>

          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center">
              <span className="text-sm font-medium text-blue-600 hover:underline shrink-0">
                {star} star
              </span>
              <div className="w-3/4 h-4 mx-2 bg-gray-200 rounded">
                <div
                  className="h-4 bg-yellow-400 rounded"
                  style={{
                    width: `${
                      product.reviews
                        ? (product.reviews.filter(
                            (review) => review.rating === star
                          ).length /
                            product.reviews.length) *
                          100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-500">
                {product.reviews
                  ? `${Math.round(
                      (product.reviews.filter(
                        (review) => review.rating === star
                      ).length /
                        product.reviews.length) *
                        100
                    )}%`
                  : "0%"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
