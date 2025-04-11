'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import CardsWrapper from '../../../items/cardsWrapper/CardsWrapper';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Title } from '@/components/ui/title';
import axios from 'axios';

const Cars = () => {
  const [cars, setCars] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/category/Vehicles');
        setCars(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <Title className="w-max" size="md" as="h2">
          Cars
        </Title>
        <div>
          <Link href="/items" className="flex text-xs text-primary sm:text-sm">
            View More <ChevronRight className="size-4 sm:size-5" />
          </Link>
        </div>
      </div>
      <CardsWrapper data={cars} />
    </>
  );
};

export default Cars;
