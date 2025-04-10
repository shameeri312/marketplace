/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { Title } from '@/components/ui/title';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import { Text } from '@/components/ui/text';
import EditForm from './form';
import axios from 'axios';
import Loading from '@/components/loading/Loading';

const EditItem = ({ id }: { id: number }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    (async () => {
      try {
        const url = `/api/items/${id}/`;
        const res = await axios.get(url);

        if (res.status === 200) {
          setItem(res.data);

          // Set the selected category if it exists in categories
          const itemCategory = res.data?.category;
          if (itemCategory && Object.keys(categories).includes(itemCategory)) {
            setSelectedCategory(itemCategory);
          }

          setIsLoading(false);
        }
      } catch (error: any) {
        setIsLoading(false);
        console.log(error);
      }
    })();
  }, [id]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-2 rounded-md border border-input p-4 shadow-md md:p-6">
      <Title className="font-semibold">Edit the ad</Title>

      {/* category selection */}
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="h-max w-full rounded-sm border p-2 md:w-1/2 lg:w-1/3">
          <Text className="pb-2">Select a category</Text>
          <div className="flex flex-wrap gap-3">
            {Object.keys(categories).map((key) => (
              <div key={key} className="flex items-center gap-2 truncate">
                <Label htmlFor={key}>
                  <Button
                    className={`h-8 !px-4 font-normal`}
                    variant={selectedCategory === key ? 'default' : 'outline'}
                    onClick={() => handleCategorySelect(key)}
                  >
                    {key}
                  </Button>
                </Label>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full rounded-sm border p-2 md:w-1/2 lg:w-2/3 lg:p-3">
          <Text className="pb-2">Fill the form</Text>
          <EditForm
            item={item}
            selectedCategory={selectedCategory || item?.category}
          />
        </div>
      </div>
    </div>
  );
};

export default EditItem;
