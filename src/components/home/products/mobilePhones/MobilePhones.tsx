import React from 'react';
import CardsWrapper from '../../cardsWrapper/CardsWrapper';
import { mobiles } from '@/lib/data';

const MobilePhones = () => {
  return (
    <>
      <CardsWrapper data={mobiles} />
    </>
  );
};

export default MobilePhones;
