import ItemView from '@/components/itemView/ItemView';
import React from 'react';

const ItemPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const id = (await params)?.id;

  return (
    <div>
      <div className="padding container">
        <ItemView id={id} />{' '}
      </div>
    </div>
  );
};

export default ItemPage;
