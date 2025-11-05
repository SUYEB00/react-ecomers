// LatestProducts.jsx
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";

export default function LatestProducts() {
  const [products, setProducts] = useState([]);

  // fetch JSON data
  useEffect(() => {
    fetch("/Public/Products.json") // your JSON file path or API
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className=" max-full mx-auto w-11/12 mb-3">
      <h2 className="text-2xl font-mon font-bold mb-5 text-center text-[#ff8f9c]">Latest Products</h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={20}
        autoplay={{ delay: 3000 }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        className="rounded-xl"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div className='font-mon transition-transform duration-300 hover:scale-105 border border-[#E5E7EB] rounded-2xl bg-[#ffffff]'>
                 <img src={product.product_picture} alt={product.title}
                 className='h-[80%] mx-auto w-[80%] object-cover rounded-lg'
                 />
                 <div className='flex p-2'>
                    <div>
                        <h3 className='text-[#21214c] fonr-mon'>
                            {product.title}
                        </h3>
                        <div className='flex text-[#f6a355]'><FaStar/> <FaStar/> <FaStar/> <FaStar/> <FaRegStarHalfStroke/></div>
                        <p className='flex gap-2 mb-3'><div className='line-through'>{product.withoutdis}</div> <strong>{product.price}</strong>  BDT</p>
                    </div>
                 </div>
                </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
