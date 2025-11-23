// LatestProducts.jsx
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";
import { FaRegStarHalfStroke } from "react-icons/fa6";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

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
        toast.error("Failed to load product data. Please try again.");
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className=" max-full mx-auto w-11/12 mb-3">
      <h2 className="text-2xl font-pop font-bold mt-5 mb-5 text-center text-[#ff8f9c]">
        Latest Products
      </h2>

      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={20}
        autoplay={{ delay: 3000 }}
        breakpoints={{
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 6 },
        }}
        className="rounded-xl"
      >
        {products.map((product) => (
          <SwiperSlide key={product.id}>
            <div
              className="h-50 md:h-65 font-mon transition-transform duration-300 hover:scale-105 border border-[#E5E7EB] rounded-2xl bg-[#ffffff]"
              onClick={async () => {
                try {
                  const snap = await getDocs(collection(db, "PaymentMethods"));
                  const paymentMethods = snap.docs.map((doc) > ({
                    id: doc.id,
                    ...doc.data(),
                  }));

                  if (paymentMethods.length === 0) {
                    toast.error("No payment method found!");
                    return;
                  }

                  const payment = paymentMethods[0]; // use first payment method

                  navigate("/checkout", {
                    state: {
                      product,
                      payment,
                    },
                  });
                } catch (error) {
                  console.log(error);
                  toast.error("Failed to load payment method!");
                }
              }}
            >
              <img
                src={product.product_picture}
                alt={product.title}
                className="h-[120px] w-[120px] lg:h-[70%] mx-auto lg:w-[70%] object-cover rounded-lg"
              />
              <div className="flex p-2">
                <div>
                  <h3 className="text-[#21214c] fonr-mon">{product.title}</h3>
                  <div className="flex text-[#f6a355]">
                    <FaStar /> <FaStar /> <FaStar /> <FaStar />{" "}
                    <FaRegStarHalfStroke />
                  </div>
                  <div className="flex gap-2 mb-3">
                    <p className="line-through">{product.oldprice}</p>{" "}
                    <strong>{product.newprice}</strong> BDT
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
