/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Title } from '@/components/ui/title';
import { categories } from '@/lib/categories';
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';

const CategorySidebar = ({ category }: { category?: string }) => {
  // Extract subcategories for the provided category prop

  const subcategories = category
    ? categories[
        category === 'mobilePhones'
          ? 'Mobile Phones'
          : (category as keyof typeof categories)
      ] || []
    : [];

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );

  const handleCategoryToggle = (subcategory: string) => {
    // Toggle subcategory selection
    setSelectedSubcategories((prevSelected) =>
      prevSelected.includes(subcategory)
        ? prevSelected.filter((item) => item !== subcategory)
        : [...prevSelected, subcategory]
    );
  };

  return (
    <div className="space-y-2 rounded-md bg-secondary/70 p-4">
      <Title size="md" className="font-medium">
        {category == 'mobilePhones' ? 'Mobile Phones' : category}
      </Title>

      <Separator />
      <Title size="sm" className="font-medium">
        Subcategories
      </Title>
      <Separator />
      {subcategories.length > 0 ? (
        <div className="flex flex-col gap-2 pl-2">
          {subcategories.map((subcategory: any, index: any) => (
            <div key={index} className="flex items-center gap-2 truncate">
              <Checkbox
                id={subcategory}
                checked={selectedSubcategories.includes(subcategory)}
                onCheckedChange={() => handleCategoryToggle(subcategory)}
              />
              <Label htmlFor={subcategory}>
                <Button
                  className="!h-4 !p-0 font-normal text-muted-foreground hover:text-black"
                  variant={'link'}
                >
                  {subcategory}
                </Button>
              </Label>
            </div>
          ))}
        </div>
      ) : (
        <div className="pl-2">
          <p>No subcategories available for this category.</p>
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;
