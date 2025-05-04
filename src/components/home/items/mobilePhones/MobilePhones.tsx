/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import CardsWrapper from '../../../items/cardsWrapper/CardsWrapper';
import { Title } from '@/components/ui/title';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import axios from 'axios';

const MobilePhones = () => {
  const [mobilePhones, setMobilePhones] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/category/Mobile Phones');
        setMobilePhones(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <Title className="w-max" size="md" as="h2">
          Mobile Phones
        </Title>
        <div>
          <Link
            href="/category/mobilePhones"
            className="flex text-xs text-primary sm:text-sm"
          >
            View More <ChevronRight className="size-4 sm:size-5" />
          </Link>
        </div>
      </div>
      {/* items */}
      <CardsWrapper data={mobilePhones} />
    </>
  );
};

export default MobilePhones;
