'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Title } from '@/components/ui/title';
import { categories } from '@/lib/categories';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';

const Sidebar = ({
  query,
  category,
}: {
  query?: string;
  category?: string[];
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    category || []
  );

  // Initialize selected categories from query params
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategories(categoryParam.split(','));
    }
    if (query) {
      console.log(selectedCategories);
    }
  }, [searchParams]);

  // Create or update the query string with the given key/value pair
  // const createQueryString = useCallback(
  //   (name: string, value: string) => {
  //     const params = new URLSearchParams(searchParams.toString());
  //     params.set(name, value);
  //     return params.toString();
  //   },

  //   [searchParams]
  // );

  // const handleCategoryToggle = (category: string) => {
  //   const updatedCategories = selectedCategories.includes(category)
  //     ? selectedCategories.filter((item) => item !== category)
  //     : [...selectedCategories, category];

  //   setSelectedCategories(updatedCategories);

  //   const queryString = createQueryString(
  //     'category',
  //     updatedCategories.join(',')
  //   );

  //   // Push the updated query string to the router
  //   router.push(`${pathname}?${queryString}`);
  // };

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);

    // Create a new search params object excluding the 'query' parameter
    const params = new URLSearchParams(searchParams.toString());
    params.delete('query'); // Remove the query parameter

    // Add or update the 'category' parameter
    params.set('category', updatedCategories.join(','));

    // Replace the URL without redirecting
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      <Title as="h6" size="sm" className="mb-2 rounded-md bg-secondary/70 p-4">
        Explore:{' '}
        {query && (
          <>
            <span className="font-semibold capitalize">{query}</span>
          </>
        )}
      </Title>
      <div className="space-y-2 rounded-md bg-secondary/70 p-4">
        <Title size="md">Categories</Title>
        <Separator />
        <div className="flex flex-col gap-2 pl-2">
          {Object.keys(categories).map((key, index) => (
            <div key={index} className="flex items-center gap-2 truncate">
              <Checkbox
                id={key}
                checked={selectedCategories.includes(key)}
                onCheckedChange={() => handleCategoryToggle(key)}
              />
              <Label htmlFor={key}>
                <Button
                  className="!h-4 !p-0 font-normal text-muted-foreground hover:text-black"
                  variant={'link'}
                >
                  {key}
                </Button>
              </Label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
