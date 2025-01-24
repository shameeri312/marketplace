'use client';
import React from 'react';
// Import Swiper React components
// import Swiper core and required modules
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import Image from 'next/image';

const FeaturedSlider = () => {
  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      className="mt-2 h-[150px] w-full rounded-2xl sm:h-[200px] md:mt-4 md:h-[250px] lg:h-[300px]"
      spaceBetween={0}
      slidesPerView={1}
      pagination={{ clickable: true }}
      scrollbar={{ draggable: true }}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
    >
      <SwiperSlide className="relative h-[300px] w-full">
        <Image
          src={'/featureAd.png'}
          alt="feature ad"
          fill
          className="object-cover"
        />
      </SwiperSlide>
      <SwiperSlide className="relative h-[300px] w-full">
        <Image
          src={'/featureAd.png'}
          alt="feature ad"
          fill
          className="object-cover"
        />
      </SwiperSlide>
      <SwiperSlide className="relative h-[300px] w-full">
        <Image
          src={'/featureAd.png'}
          alt="feature ad"
          fill
          className="object-cover"
        />
      </SwiperSlide>
      <SwiperSlide className="relative h-[300px] w-full">
        <Image
          src={'/featureAd.png'}
          alt="feature ad"
          fill
          className="object-cover"
        />
      </SwiperSlide>
    </Swiper>
  );
};

export default FeaturedSlider;
