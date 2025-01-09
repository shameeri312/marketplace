import React from 'react';

interface Params {
  category: string;
}
const CategoryPage = async ({ params }: { params: Promise<Params> }) => {
  const category = decodeURIComponent((await params).category) || undefined;
  return <>Category: {category}</>;
};

export default CategoryPage;
