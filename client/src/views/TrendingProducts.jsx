import React, { useState, useEffect } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
import "swiper/css/autoplay";

// Initialize modules
// Swiper.use([Navigation, Autoplay, Pagination]);

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <h2 className="text-4xl text-center font-semibold mt-16 mb-10">
        Trending Products
      </h2>
      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        spaceBetween={5}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        // style={{ height: '300px' }}
        breakpoints={{
          320: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          480: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          640: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        }}
        // to make all slides equal height
        autoHeight={true}
      >
        {products.map((product) => (
          <SwiperSlide key={product._id}>
            <div className="bg-white rounded-lg text-center shadow-md p-4 h-full">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="size-[300px] object-cover transition-transform duration-300 ease-in-out hover:scale-110 group-hover:brightness-90"
              />
              {/* <div className="mt-4 group">
              <h3 className="text-lg font-semibold transition-colors duration-300 group-hover:text-blue-600">{product.name}</h3>
              <p className="text-gray-600">{product.category}</p>
              <p className="text-lg font-semibold">${product.price}</p>
            </div> */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default TrendingProducts;
