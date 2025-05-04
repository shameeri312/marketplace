/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Title } from '@/components/ui/title';
import { categories } from '@/lib/categories';
import React from 'react';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

const CategorySidebar = ({ category }: { category?: string }) => {
  // Extract subcategories for the provided category prop

  const subcategories = category
    ? categories[
        category === 'mobilePhones'
          ? 'Mobile Phones'
          : (category as keyof typeof categories)
      ] || []
    : [];

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
              <Label htmlFor={subcategory}>
                <Link href={`/items?query=${subcategory}`}>
                  <Button
                    className="!h-4 !p-0 font-normal text-muted-foreground hover:text-black"
                    variant={'link'}
                  >
                    {subcategory}
                  </Button>
                </Link>
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
