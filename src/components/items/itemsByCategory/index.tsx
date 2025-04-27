/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import ProductCard from '@/components/items/productCard/ProductCard';
import Loading from '@/components/loading/Loading';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FcEmptyTrash } from 'react-icons/fc';
import { Title } from '@/components/ui/title';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

const ItemsByCategory = ({ category }: { category: string }) => {
  const [items, setItems] = useState<any[]>([]);
  const params = useSearchParams();
  const searchParamQuery = params.get('query') || '';
  const searchCategoryParam = params.get('category') || '';
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchCategoryParam ? searchCategoryParam.split(',') : []
  );
  const [query, setQuery] = useState<string>(searchParamQuery);
  const [visibleItems, setVisibleItems] = useState<number>(9);

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
    // Simulate filtering process
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchParamQuery, searchCategoryParam, query]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const url = `/api/category/${category}`;
        const res = await fetch(url);

        if (res.status === 200) {
          const data = await res.json();
          setItems(data);
          console.log('Items:', data);
        }
      } catch (error: any) {
        console.log('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [category]);

  // Group items by name for price comparison (Mobile Phones only)
  const priceComparisonData =
    category === 'Mobile Phones'
      ? items.reduce(
          (acc, item) => {
            const itemName = item.name || 'Unknown Item';
            if (!acc[itemName]) {
              acc[itemName] = [];
            }
            acc[itemName].push({
              price: item.price || 0,
              seller:
                item.userDetails.firstName + ' ' + item.userDetails.lastName ||
                'Unknown Seller',
              id: item.id || item._id || Math.random().toString(),
              keywords: item.keywords || [],
            });
            return acc;
          },
          {} as Record<
            string,
            { price: number; seller: string; id: string; keywords: string[] }[]
          >
        )
      : {};

  // Filter price comparison data based on query and multiple listings
  const filteredPriceData =
    category === 'Mobile Phones'
      ? Object.entries(priceComparisonData).reduce(
          (acc, [itemName, listings]) => {
            // Only include items with two or more listings
            if (listings.length < 2) return acc;

            const matchesQuery = query
              ? itemName.toLowerCase().includes(query.toLowerCase()) ||
                listings.some((listing) =>
                  listing.keywords.some((keyword: string) =>
                    keyword.toLowerCase().includes(query.toLowerCase())
                  )
                )
              : true;
            if (matchesQuery) {
              acc[itemName] = listings;
            }
            return acc;
          },
          {} as Record<
            string,
            { price: number; seller: string; id: string; keywords: string[] }[]
          >
        )
      : {};

  // Filter items based on selected categories and query
  const filteredItems = items.filter((item: any) => {
    const matchesCategory = selectedCategories.length
      ? selectedCategories.some((selectedCategory) =>
          Array.isArray(item.category)
            ? item.category.some(
                (cat: any) =>
                  cat.toLowerCase() === selectedCategory.toLowerCase()
              )
            : item.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : true;

    const matchesQuery = query
      ? item.keywords &&
        item.keywords.some((keyword: any) =>
          keyword.toLowerCase().includes(query.toLowerCase())
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
    (selectedCategories.length > 0 && filteredItems.length === 0) ||
    (query.length > 0 && filteredItems.length === 0);

  return (
    <div className="h-full rounded-md bg-secondary/70 p-2 md:p-4">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Price Comparison Tool for Mobile Phones */}
          {category === 'Mobile Phones' && (
            <div className="mb-6">
              <Title size="md" as="h3" className="mb-4">
                Price Comparison
              </Title>
              {Object.keys(filteredPriceData).length > 0 ? (
                <div className="space-y-4">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-2 text-left">Item</th>
                        <th className="border p-2 text-left">Seller</th>
                        <th className="border p-2 text-left">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(filteredPriceData).map(
                        ([itemName, listings]) =>
                          listings
                            .sort((a, b) => a.price - b.price) // Sort by price (lowest first)
                            .map((listing, index) => (
                              <tr
                                key={`${itemName}-${index}`}
                                className="border-b"
                              >
                                {index === 0 && (
                                  <td
                                    className="border p-2"
                                    rowSpan={listings.length}
                                  >
                                    {itemName}
                                  </td>
                                )}
                                <td className="border p-2">{listing.seller}</td>
                                <td className="border p-2">
                                  <Link
                                    href={`/item/${listing.id}`}
                                    className="text-blue-600 hover:underline"
                                  >
                                    ${listing.price.toFixed(2)}
                                  </Link>
                                </td>
                              </tr>
                            ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : (
                <Text className="text-sm">
                  No price comparisons available for{' '}
                  <b>{query ? `query: ${query}` : 'Mobile Phones'}</b>
                </Text>
              )}
              <Separator className="my-4" />
            </div>
          )}

          {/* Item Grid */}
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

export default ItemsByCategory;
