/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { IoMdHeartEmpty } from 'react-icons/io';
import { Title } from '@/components/ui/title';
import { useRouter } from 'next/navigation';
import { Text } from '@/components/ui/text';
import Image from 'next/image';
import React from 'react';

const ProductCard = ({ content }: { content: any }) => {
  const router = useRouter();

  const image = content?.image1 ?? '/uploads/default.jpg';

  return (
    <Card
      onClick={() => router.push(`/item/${content._id}`)}
      className="w-[250px] cursor-pointer space-y-3 overflow-hidden p-1 shadow-md md:w-full"
    >
      <Image
        src={image || '/uploads/default.jpg'}
        alt={'product image'}
        className="h-[120px] rounded-t-md object-cover sm:w-full md:h-[150px] xl:h-[200px]"
        width={400}
        height={200}
      />
      <CardContent className="md:px-auto px-2 pb-2 md:pb-0">
        <div className="flex items-center justify-between">
          <Text className="font-semibold" as="p">
            <span className="text-accent-foreground">
              {content.price || content.salary} {content.currency}{' '}
            </span>
          </Text>

          <IoMdHeartEmpty className="size-5" />
        </div>
        <Title
          size="sm"
          className="catpitalize truncate text-secondary-foreground"
          as="h6"
        >
          {content.name || content.title}
        </Title>
        <Text className="truncate font-medium" as="p">
          <span className="text-xs font-light text-accent-foreground sm:text-sm">
            {content?.street || 'Lorem ipsum dolor sit amet Lorem, ipsum dolor'}
            , {content?.city}
          </span>
        </Text>

        <Text className="font-medium" as="p">
          <span className="text-xs font-light text-accent-foreground sm:text-sm">
            {/* {formatRelativeTime()} */}
            {content?.created_at || 'a while ago'}
          </span>
        </Text>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
