import EditItem from '@/components/items/editItem/editItem';
import React from 'react';

const ItemPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const id = (await params)?.id;

    
    
  return (
    <>
      <div className="padding container">
        <EditItem id={id} />
      </div>
    </>
  );
};

export default ItemPage;
