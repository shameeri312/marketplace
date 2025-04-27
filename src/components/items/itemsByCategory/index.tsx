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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

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
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isCompareDialogOpen, setIsCompareDialogOpen] =
    useState<boolean>(false);

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
          console.log('Fetched Items:', data); // Debug: Log fetched items
          setItems(data);
        }
      } catch (error: any) {
        console.log('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [category]);

  // Handle item selection for comparison
  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId);
      }
      if (prev.length >= 2) {
        return prev; // Limit to 2 items
      }
      return [...prev, itemId];
    });
  };

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
                item.userDetails?.firstName && item.userDetails?.lastName
                  ? `${item.userDetails.firstName} ${item.userDetails.lastName}`
                  : 'Unknown Seller',
              id: item.id || item._id || Math.random().toString(),
              keywords:
                typeof item.keywords === 'string'
                  ? item.keywords.split(',').map((k: string) => k.trim())
                  : Array.isArray(item.keywords)
                    ? item.keywords
                    : [],
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
        (typeof item.keywords === 'string'
          ? item.keywords
              .split(',')
              .map((k: string) => k.trim())
              .some((keyword: string) =>
                keyword.toLowerCase().includes(query.toLowerCase())
              )
          : Array.isArray(item.keywords)
            ? item.keywords.some((keyword: string) =>
                keyword.toLowerCase().includes(query.toLowerCase())
              )
            : false)
      : true;

    return matchesCategory && matchesQuery;
  });

  // Get items to display based on "Load More" pagination
  const displayedItems = filteredItems.slice(0, visibleItems);

  // Load more items
  const loadMore = () => {
    setVisibleItems((prev) => prev + 9);
  };

  // Get selected items for comparison
  const compareItems = items.filter((item) => selectedItems.includes(item._id));

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
            <div className="flex w-full items-center justify-between">
              <Title size="sm" className="font-medium">
                Compare Mobile Phones
              </Title>
              {/* Compare Button */}
              {category === 'Mobile Phones' && (
                <Button
                  size={'sm'}
                  className="mt-4"
                  disabled={selectedItems.length < 2}
                  onClick={() => setIsCompareDialogOpen(true)}
                >
                  Compare Selected Items
                </Button>
              )}
            </div>
          )}
          <Separator className="my-4" />

          {/* Item Grid */}
          {displayedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {displayedItems.map((content: any, index: number) => (
                <div key={index}>
                  <ProductCard
                    content={content}
                    isSelectable={category === 'Mobile Phones'}
                    isSelected={selectedItems.includes(content._id)}
                    onSelect={() => handleSelectItem(content._id)}
                  />
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

          {/* Comparison Dialog */}
          {category === 'Mobile Phones' && (
            <Dialog
              open={isCompareDialogOpen}
              onOpenChange={setIsCompareDialogOpen}
            >
              <DialogContent className="h-[99vh] overflow-y-auto sm:h-max sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle className="text-center">
                    Compare Mobile Phones
                  </DialogTitle>
                </DialogHeader>
                <Separator />
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:p-4">
                  {compareItems.map((item) => {
                    return (
                      <div key={item._id} className="flex flex-col space-y-4">
                        <h3 className="text-lg font-semibold">
                          {item.adTitle || item.name || 'Untitled Item'}
                        </h3>
                        <div className="flex justify-center">
                          {item.image1 || item.image2 || item.image3 ? (
                            <Image
                              src={item.image1 || item.image2 || item.image3}
                              alt={item.adTitle || item.name || 'Item image'}
                              width={200}
                              height={200}
                              className="h-40 w-full rounded-lg object-cover shadow-lg sm:h-48 md:h-52"
                            />
                          ) : (
                            <div className="flex h-48 w-48 items-center justify-center rounded-md bg-gray-200">
                              <span className="text-gray-500">No image</span>
                            </div>
                          )}
                        </div>

                        <Table className="w-full text-sm">
                          <TableBody>
                            <TableRow>
                              <TableCell className="pr-2 font-bold">
                                Price:
                              </TableCell>
                              <TableCell>
                                {item.price && item.currency
                                  ? `${item.currency} ${item.price.toFixed(2)}`
                                  : item.salary && item.currency
                                    ? `${item.currency} ${item.salary}`
                                    : 'N/A'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pr-2 font-bold">
                                Description:
                              </TableCell>
                              <TableCell>
                                {item.description || 'No description available'}
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pr-2 font-bold">
                                Category:
                              </TableCell>
                              <TableCell>{item.category || 'N/A'}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="pr-2 font-bold">
                                Seller:
                              </TableCell>
                              <TableCell>
                                {item.userDetails?.firstName &&
                                item.userDetails?.lastName
                                  ? `${item.userDetails.firstName} ${item.userDetails.lastName}`
                                  : 'Unknown'}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCompareDialogOpen(false)}
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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
        </>
      )}
    </div>
  );
};

export default ItemsByCategory;
