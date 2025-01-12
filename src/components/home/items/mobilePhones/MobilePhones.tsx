import React from 'react';
import CardsWrapper from '../../cardsWrapper/CardsWrapper';
import { mobiles } from '@/lib/data';
import { Title } from '@/components/ui/title';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const MobilePhones = () => {
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <Title className="w-max" size="md" as="h2">
          Mobile Phones
        </Title>
        <div>
          <Link
            href="/category/mobiles"
            className="flex text-xs text-primary sm:text-sm"
          >
            View More <ChevronRight className="size-4 sm:size-5" />
          </Link>
        </div>
      </div>
      {/* items */}
      <CardsWrapper data={mobiles} />
    </>
  );
};

export default MobilePhones;
