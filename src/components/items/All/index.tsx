/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProductCard from '@/components/home/ProductCard/ProductCard';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { bikes, cars, mobiles, property } from '@/lib/data';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FcEmptyTrash } from 'react-icons/fc';

const Items = () => {
  const params = useSearchParams();
  const searchParamQuery = params.get('query') || ''; // Get 'query' from URL params
  const searchCategoryParam = params.get('category') || ''; // Get 'category' from URL params

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchCategoryParam ? searchCategoryParam.split(',') : [] // Initialize from query params
  );
  const [query, setQuery] = useState<string>(searchParamQuery); // Initialize query with URL param
  const [visibleItems, setVisibleItems] = useState<number>(9); // For "Load More" functionality

  const allItems = [...mobiles, ...cars, ...property, ...bikes];

  useEffect(() => {
    // Update query and selected categories whenever URL params change
    setQuery(searchParamQuery);
    setSelectedCategories(
      searchCategoryParam ? searchCategoryParam.split(',') : []
    );
  }, [searchParamQuery, searchCategoryParam]);

  // Filter items based on selected categories and query
  const filteredItems = allItems.filter((item) => {
    // Filter by selected categories if any category is selected
    const matchesCategory = selectedCategories.length
      ? selectedCategories.includes(item.category)
      : true;

    // Search by keywords or other properties
    const matchesQuery = query
      ? item.keywords.some((keyword) =>
          keyword.toLowerCase().includes(query.toLowerCase())
        )
      : true;

    return matchesCategory && matchesQuery;
  });

  // Get items to display based on "Load More" pagination
  const displayedItems = filteredItems.slice(0, visibleItems);
  console.log();

  // Load more items
  const loadMore = () => {
    setVisibleItems((prev) => prev + 9);
  };

  return (
    <div className="h-full rounded-md bg-secondary/70 p-2 md:p-4">
      {displayedItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {displayedItems.map((content: any, index: number) => (
            <div key={index}>
              <ProductCard content={content} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid h-full w-full place-content-center">
          <FcEmptyTrash className="mx-auto size-16" />
          <Text className="text-sm">
            No items found for <b>{query || selectedCategories.join(',')}</b>
          </Text>
        </div>
      )}
      <div className="flex justify-center">
        {/* Load More Button */}
        {visibleItems < filteredItems.length && (
          <Button
            className="mx-auto my-4"
            variant={'outline'}
            onClick={loadMore}
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default Items;
