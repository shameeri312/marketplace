/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React from 'react';
import ProductCard from '../ProductCard/ProductCard';

const CardsWrapper = ({ data }: { data: any }) => {
  console.log(data);

  return (
    <div className="scrollbar-hide overflow-x-auto pb-2">
      <div className="flex w-[1280px] gap-4 overflow-x-auto md:grid md:grid-cols-4 lg:w-[1360px]">
        {data.map((content: any, index: number) => (
          <div key={index}>
            <ProductCard content={content} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardsWrapper;
