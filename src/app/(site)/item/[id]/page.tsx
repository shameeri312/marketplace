import React from 'react';

const ItemPage = async ({ params }: { params: Promise<{ id: number }> }) => {
  const id = (await params)?.id || undefined;
  return <div>ItemPage for {id}</div>;
};

export default ItemPage;
