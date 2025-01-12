import React from 'react';
import CardsWrapper from '../../cardsWrapper/CardsWrapper';
import { cars } from '@/lib/data';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Title } from '@/components/ui/title';

const Cars = () => {
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <Title className="w-max" size="md" as="h2">
          Cars
        </Title>
        <div>
          <Link
            href="/category/cars"
            className="flex text-xs text-primary sm:text-sm"
          >
            View More <ChevronRight className="size-4 sm:size-5" />
          </Link>
        </div>
      </div>
      <CardsWrapper data={cars} />
    </>
  );
};

export default Cars;
