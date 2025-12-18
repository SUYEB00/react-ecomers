// RelatedProducts.jsx
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function RelatedProducts({ category, currentId }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelated = async () => {
      const snapshot = await getDocs(collection(db, "Products"));
      let data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // ✅ Filter by category & exclude current product
      const related = data
        .filter((p) => p.category === category && p.id !== currentId)
        .slice(0, 6);

      setProducts(related);
    };

    if (category) fetchRelated();
  }, [category, currentId]);

  if (products.length === 0) return null;

  return (
    <div className="w-11/12 mx-auto shadow bg-white p-3 mt-10 rounded-2xl">
      <h2 className="text-2xl font-pop font-bold ml-2 mb-3 text-black">
        Related Products
      </h2>

      <Swiper
        modules={[Autoplay]}
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
              onClick={() => navigate(`/product/${product.id}`)}
              className="relative block border border-gray-200 rounded-xl bg-white shadow-sm 
              transition-transform duration-300 hover:scale-105 mt-2 mb-2 p-2 
              w-[140px] mx-auto sm:p-3 sm:w-[180px] lg:w-[200px]"
            >
              <img
                src={product.product_picture}
                alt={product.title}
                className="h-[100px] w-[100px] mx-auto rounded object-cover 
                sm:h-[160px] sm:w-[160px]"
              />

              <div className="mt-2 px-1">
                <h3 className="font-mon truncate text-xs sm:text-sm font-semibold text-left">
                  {product.title}
                </h3>

                <div className="flex text-yellow-400 text-xs sm:text-sm">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaRegStarHalfStroke />
                </div>

                <div className="flex items-center gap-2 mt-1">
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
