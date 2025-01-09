import React from 'react';
import CardsWrapper from '../../cardsWrapper/CardsWrapper';
import { cars } from '@/lib/data';

const Cars = () => {
  return (
    <>
      <CardsWrapper data={cars} />
    </>
  );
};

export default Cars;
