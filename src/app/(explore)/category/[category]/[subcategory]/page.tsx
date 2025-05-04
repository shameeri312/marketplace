import React from 'react';

interface Params {
  subcategory: string;
}
const SubCategoryPage = async ({ params }: { params: Promise<Params> }) => {
  const subcategory =
    decodeURIComponent((await params).subcategory) || undefined;
  return <>Category: {subcategory}</>;
};

export default SubCategoryPage;
