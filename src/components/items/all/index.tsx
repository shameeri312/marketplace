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
  const [items, setItems] = useState<any[]>([]);
  const { data: session }: any = useSession();
  const searchParamQuery = params.get('query') || '';
  const searchCategoryParam = params.get('category') || '';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleItems, setVisibleItems] = useState<number>(9);

  console.log(session);

  useEffect(() => {
    const token = session?.user?.token;
    console.log('Token:', token);

    const fetchItems = async () => {
      try {
        const url = '/api/items'; // Fetch all items without query parameters
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.status === 200) {
          setItems(res.data);
          console.log('All Items:', res.data);
        }
      } catch (error: any) {
        console.log('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchItems();
    }
  }, [session?.user]);

  // Filter items based on query and category
  const filteredItems = items.filter((item: any) => {
    const matchesCategory = searchCategoryParam
      ? item.category.toLowerCase() === searchCategoryParam.toLowerCase()
      : true;

    const matchesQuery = searchParamQuery
      ? item.keywords.some((keyword: string) =>
          keyword.toLowerCase().includes(searchParamQuery.toLowerCase())
        )
      : true;

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
    (searchCategoryParam && filteredItems.length === 0) ||
    (searchParamQuery && filteredItems.length === 0);

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
                      {searchParamQuery
                        ? `query: ${searchParamQuery}`
                        : `category: ${searchCategoryParam}`}
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
