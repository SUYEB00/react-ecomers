import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";


import "swiper/css";
import "swiper/css/pagination";
import "../index.css"; // keep styles here

// Import images
import slider1 from "../assets/Slider1.png";
import slider2 from "../assets/Slider2.png";
import slider3 from "../assets/Slider3.png";
import slider4 from "../assets/Slider4.png";
import slider5 from "../assets/Slider5.png";

export default function Carousel() {
  // Keep all images in an array
  const slides = [slider1, slider2, slider3, slider4, slider5];

  return (
    <div className="w-full">
      <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      spaceBetween={20}
      slidesPerView={1}
      className="mySwiper w-full  md:h-[70vh] lg:h-[80vh] "
    >
      {slides.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} alt={`Slide ${index + 1}`} className="slider-img w-full h-full mt-10 object-cover" />
          
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}
