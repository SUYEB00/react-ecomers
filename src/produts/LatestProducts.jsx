import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import toast from "react-hot-toast";

import { FiTrendingUp } from "react-icons/fi";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { HiOutlineBadgeCheck } from "react-icons/hi";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "Products"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load product data");
      }
    };

    fetchProducts();
  }, []);

  const openProduct = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="w-11/12 mx-auto shadow bg-white p-3 mt-5 rounded-2xl">
      <h2 className="text-2xl font-pop font-bold ml-2 mb-3 text-black flex items-center gap-2">
        <FiTrendingUp className="text-blue-500" /> Latest Products
      </h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={2}
        spaceBetween={10}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          480: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
      >
        {products
          .filter((product) => product.stock > 0)
          .map((product) => (
            <SwiperSlide key={product.id}>
              <button
                type="button"
                onClick={() => openProduct(product)}
                className="relative block border border-gray-200 rounded-xl bg-white shadow-sm 
          transition-transform duration-300 hover:scale-105 mt-2 mb-2 p-2 
          w-[140px] mx-auto sm:p-3 sm:w-[180px] lg:w-[200px]"
              >
                {/* Latest Badge */}
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] sm:text-xs font-bold px-2 py-1 rounded-full shadow">
                  Latest
                </div>

                <img
                  src={product.product_picture}
                  alt={product.title}
                  className="h-[100px] w-[100px] mx-auto rounded object-cover sm:h-[160px] sm:w-[160px]"
                />

                <div className="mt-2 px-1">
                  <h3 className="font-mon text-[#21214c] truncate text-xs sm:text-sm font-bold text-left">
                    {product.title}
                  </h3>

                  {product.sold !== undefined && (
                    <span className="flex items-center gap-1 text-[10px] text-green-600">
                      <HiOutlineBadgeCheck className="text-xs" />
                      {product.sold} sold
                    </span>
                  )}

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
