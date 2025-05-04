/* eslint-disable @typescript-eslint/no-explicit-any */
// Assuming `allItems` is your data array
import CategorySidebar from '@/components/items/categorySidebar/CategorySidebar';
import ItemsByCategory from '@/components/items/itemsByCategory';
import React from 'react';

interface Params {
  category: string;
}

const CategoryPage = async ({ params }: { params: Promise<Params> }) => {
  const category = decodeURIComponent((await params)?.category);

  return (
    <div className="p-4">
      {
        <section className="container flex flex-col gap-4 md:flex-row md:gap-2">
          <div className="md:1/3 lg:w-1/4">
            <CategorySidebar category={category || ''} />
          </div>

          <div className="md:2/3 lg:w-3/4">
            <ItemsByCategory category={category} />
          </div>
        </section>
      }
    </div>
  );
};

export default CategoryPage;
