import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

import "swiper/css";
import "swiper/css/pagination";
import "../index.css";

export default function Carousel() {
  const [slides, setSlides] = useState([]);

  const fetchSliders = async () => {
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    const sliderImages = querySnapshot.docs.map((doc) => doc.data().slider_img);
    setSlides(sliderImages);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  return (
    <div className="w-11/12 mx-auto flex justify-center mt-30">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={10}
        slidesPerView={1}
        className="mySwiper w-full"
      >
        {slides.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="
            w-full 
            h-[180px]          /* Mobile */
            sm:h-[250px]       /* Small devices */
            md:h-[350px]       /* Tablets */
            lg:h-[480px]       /* Desktop */
            xl:h-[550px]       /* Large screens */
            object-center 
            object-cover 
            shadow-sm
          "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
