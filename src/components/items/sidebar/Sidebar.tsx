'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Title } from '@/components/ui/title';
import { categories } from '@/lib/categories';
import React, { useState, useEffect, useCallback } from 'react';
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
  }, [searchParams]);

  // Create or update the query string with the given key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);

    const queryString = createQueryString(
      'category',
      updatedCategories.join(',')
    );

    // Push the updated query string to the router
    router.push(`${pathname}?${queryString}`);
  };

  return (
    <div className="space-y-2 rounded-md bg-secondary/70 p-4">
      <Title as="h6" size="sm" className="font-normal">
        {query ? `Search results for: ${query}` : 'Explore'}
      </Title>
      <Separator />
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
  );
};

export default Sidebar;
