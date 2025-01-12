import { Title } from '@/components/ui/title';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import CardsWrapper from '../../cardsWrapper/CardsWrapper';
import { property } from '@/lib/data';

const Property = () => {
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <Title className="w-max" size="md" as="h2">
          Property
        </Title>
        <div>
          <Link
            href="/category/property"
            className="flex text-xs text-primary sm:text-sm"
          >
            View More <ChevronRight className="size-4 sm:size-5" />
          </Link>
        </div>
      </div>
      <CardsWrapper data={property} />
    </>
  );
};

export default Property;
