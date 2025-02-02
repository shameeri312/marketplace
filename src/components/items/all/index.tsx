/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProductCard from '@/components/items/productCard/ProductCard';
import Loading from '@/components/loading/Loading';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FcEmptyTrash } from 'react-icons/fc';

const Items = () => {
  const params = useSearchParams();
  const [items, setItems] = useState<[] | []>([]);
  const { data: session }: any = useSession();
  const searchParamQuery = params.get('query') || ''; // Get 'query' from URL params
  const searchCategoryParam = params.get('category') || ''; // Get 'category' from URL params
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchCategoryParam ? searchCategoryParam.split(',') : [] // Initialize from query params
  );
  const [query, setQuery] = useState<string>(searchParamQuery); // Initialize query with URL param
  const [visibleItems, setVisibleItems] = useState<number>(9); // For "Load More" functionality

  useEffect(() => {
    // Update query and selected categories whenever URL params change
    setQuery(searchParamQuery);
    setSelectedCategories(
      searchCategoryParam ? searchCategoryParam.split(',') : []
    );
    if (query) {
      setSelectedCategories([]);
    }
  }, [searchParamQuery, searchCategoryParam]);

  useEffect(() => {
    const token = session?.user?.token;
    console.log(token);

    (async () => {
      try {
        const url = `${process.env.API_URL_PREFIX}/api/items/items/`;
        const res = await axios.get(url);
        if (res.status === 200) {
          setItems(res.data);
          console.log(res.data);
          setIsLoading(false);
        }
      } catch (error: any) {
        console.log(error);
      }
    })();
  }, [searchParamQuery, searchCategoryParam, query]);

  // Filter items based on selected categories and query
  const filteredItems = items.filter((item: any) => {
    // Filter by selected categories if any category is selected
    const matchesCategory = selectedCategories.length
      ? selectedCategories.some(
          (selectedCategory) =>
            Array.isArray(item.category)
              ? item.category.some(
                  (cat: any) =>
                    cat.toLowerCase() === selectedCategory.toLowerCase()
                ) // Check if item.category contains the selected category (case insensitive)
              : item.category.toLowerCase() === selectedCategory.toLowerCase() // Compare directly if item.category is a string (case insensitive)
        )
      : true;

    // Search by keywords or other properties
    const matchesQuery = query
      ? item.keywords
          .split(',') // Split the comma-separated string into an array
          .some((keyword: string) =>
            keyword.trim().toLowerCase().includes(query.toLowerCase())
          )
      : true;

    console.log(item?.keywords);

    return matchesCategory && matchesQuery;
  });

  // Get items to display based on "Load More" pagination
  const displayedItems = filteredItems.slice(0, visibleItems);

  // Load more items
  const loadMore = () => {
    setVisibleItems((prev) => prev + 9);
  };

  // Determine if there are no results for the category or query
  const noResultsMessage =
    (selectedCategories.length > 0 && filteredItems.length === 0) ||
    (query.length > 0 && filteredItems.length === 0);

  return (
    <div className="h-full rounded-md bg-secondary/70 p-2 md:p-4">
      {isLoading ? (
        <Loading /> // Display the loading component when isLoading is true
      ) : (
        <>
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
              {noResultsMessage && (
                <>
                  <FcEmptyTrash className="mx-auto size-16" />
                  <Text className="text-sm">
                    No items found for{' '}
                    <b>
                      {query
                        ? `query: ${query}`
                        : `category: ${selectedCategories.join(', ')}`}
                    </b>
                  </Text>
                </>
              )}
            </div>
          )}
        </>
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
