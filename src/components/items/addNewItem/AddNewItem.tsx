'use client';

import React, { useState } from 'react';
import { Title } from '@/components/ui/title';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import { Text } from '@/components/ui/text';
import AddItemForm from './form';
import { useSession } from 'next-auth/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const AddNewItem = () => {
  const { data: session } = useSession();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(
    []
  );

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategories([]); // Clear subcategories when category changes
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategories((prev) =>
      prev.includes(subCategory)
        ? prev.filter((item) => item !== subCategory)
        : [...prev, subCategory]
    );
  };

  if (!session) return <>Unauthorized</>;

  return (
    <div className="mx-auto flex max-w-[1336px] flex-col gap-2 rounded-md bg-neutral-100 border p-4 md:p-6">
      <Title className="font-semibold">Post an ad</Title>

      {/* category selection */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="h-max w-full rounded-sm border bg-white p-2 md:w-1/2 lg:w-1/3 lg:p-4">
          <Text className="pb-2">Select a category</Text>
          <div className="flex flex-wrap gap-3">
            <Accordion type="single" collapsible className="w-full">
              {Object.entries(categories).map(([key, values], index) => (
                <div key={key}>
                  <AccordionItem value={'item' + index}>
                    <AccordionTrigger
                      className={`h-10 !px-4 font-normal`}
                      onClick={() => handleCategorySelect(key)}
                    >
                      {key}
                    </AccordionTrigger>
                    <AccordionContent className="mb-2 flex flex-wrap gap-2 rounded-lg bg-neutral-100 p-2">
                      {values.map((value, index) => (
                        <Button
                          key={index}
                          className={`h-8 !px-4 font-normal`}
                          variant={
                            selectedSubCategories.includes(value)
                              ? 'default'
                              : 'outline'
                          }
                          onClick={() => handleSubCategorySelect(value)}
                        >
                          {value}
                        </Button>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </div>
              ))}
            </Accordion>
          </div>
        </div>

        <div className="w-full rounded-sm border bg-white p-2 md:w-1/2 lg:w-2/3 lg:p-4">
          <Text className="pb-2">Fill the form</Text>
          <AddItemForm
            selectedCategory={selectedCategory || ''}
            selectedSubCategories={selectedSubCategories}
          />
        </div>
      </div>
    </div>
  );
};

export default AddNewItem;
