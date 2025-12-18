// BestDeals.jsx
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { FaFire, FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function BestDeals() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "Products"));

      let data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        // ✅ hide 0 stock products
        .filter((p) => Number(p.stock) > 0);

      // calculate discount %
      data = data.map((p) => ({
        ...p,
        discountPercent: Math.round(
          ((Number(p.oldprice) - Number(p.newprice)) / Number(p.oldprice)) * 100
        ),
      }));

      // sort by highest discount & take top 6
      const top6 = data
        .sort((a, b) => b.discountPercent - a.discountPercent)
        .slice(0, 6);

      setProducts(top6);
    };

    fetchProducts();
  }, []);

  // 👉 Open product details page
  const openProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="w-11/12 mx-auto shadow bg-white p-3 mt-6 rounded-2xl">
      <h2 className="text-2xl font-pop font-bold ml-2 mb-3 text-black flex items-center gap-2">
        <FaFire className="text-red-500" /> Best Deals
      </h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={2}
        spaceBetween={10}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <button
              onClick={() => openProduct(product)}
              className="relative block border border-gray-200 rounded-xl bg-white shadow-sm 
              hover:scale-105 transition-transform mt-2 mb-2 p-2 
              w-[140px] mx-auto sm:p-3 sm:w-[180px] lg:w-[200px]"
            >
              {/* Discount Badge */}
              <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow-md">
                {product.discountPercent}% OFF
              </div>

              <img
                src={product.product_picture}
                alt={product.title}
                className="h-[100px] w-[100px] sm:h-[160px] sm:w-[160px] object-cover rounded mx-auto"
              />

              <div className="mt-2 px-1">
                <h3 className="font-mon text-[#21214c] truncate text-xs sm:text-sm font-bold text-left">
                  {product.title}
                </h3>

                <div className="flex text-yellow-400 text-xs sm:text-sm">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar />
                  <FaRegStarHalfStroke />
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <p className="line-through text-gray-400 text-[10px] sm:text-sm">
                    {product.oldprice}
                  </p>
                  <strong className="text-xs sm:text-base">
                    {product.newprice}
                  </strong>
                  <span className="text-[10px] sm:text-sm">BDT</span>
                </div>
              </div>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
