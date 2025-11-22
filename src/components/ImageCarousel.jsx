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

  // FETCH SLIDER IMAGES FROM FIRESTORE
  const fetchSliders = async () => {
    const querySnapshot = await getDocs(collection(db, "Sliders"));
    const sliderImages = querySnapshot.docs.map((doc) => doc.data().slider_img);
    setSlides(sliderImages);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  return (
    <div className="w-full">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        spaceBetween={20}
        slidesPerView={1}
        className="mySwiper w-full md:h-[70vh] lg:h-[80vh]"
      >
        {slides.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="slider-img w-full h-full mt-10 object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
