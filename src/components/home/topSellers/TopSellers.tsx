/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Title } from '@/components/ui/title';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CardsWrapper from '@/components/items/cardsWrapper/CardsWrapper';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

const TopSellers = () => {
  const [items, setItems] = useState<[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { data: session }: any = useSession();

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
        }
        setIsLoading(false);
      } catch (error: any) {
        setIsLoading(false);

        console.log(error);
      }
    })();
  }, []);

  if (items.length == 0) return null;

  return (
    <>
      <div className="flex items-center justify-between px-2">
        <Title className="w-max" size="md" as="h2">
          Top Sellers
        </Title>
        <Link href="/explore" className="flex text-xs sm:text-sm">
          <Button variant={'link'}>
            Explore All <ExternalLink className="ml-1 size-4 sm:size-5" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        // Display loading component while data is being fetched
        <div className="flex h-full items-center justify-center">
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        // Display the top sellers items
        <CardsWrapper data={items.slice(0, 5)} />
      )}
    </>
  );
};

export default TopSellers;
