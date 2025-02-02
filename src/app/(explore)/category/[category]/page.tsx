// Assuming `allItems` is your data array
import CategorySidebar from '@/components/items/categorySidebar/CategorySidebar';
import ItemsByCategory from '@/components/items/itemsByCategory';
import { allItems } from '@/lib/data';
import { capitalize } from '@/lib/utils';
import React from 'react';

interface Params {
  category: string;
}

const CategoryPage = async ({ params }: { params: Promise<Params> }) => {
  const category = decodeURIComponent((await params)?.category);

  // Filter items by the category
  const filteredItems = allItems.filter((item) => {
    return item.category.includes(category);
  });

  console.log(filteredItems);

  return (
    <div className="p-4">
      {filteredItems.length > 0 ? (
        <section className="container flex flex-col gap-4 md:flex-row md:gap-2">
          <div className="md:1/3 lg:w-1/4">
            <CategorySidebar category={capitalize(category) || ''} />
          </div>
          <div className="md:2/3 lg:w-3/4">
            <ItemsByCategory items={filteredItems} />
          </div>
        </section>
      ) : (
        <p>No items found for the selected category.</p>
      )}
    </div>
  );
};

export default CategoryPage;
