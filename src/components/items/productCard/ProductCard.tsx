/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Title } from '@/components/ui/title';
import { IoMdHeartEmpty } from 'react-icons/io';
import Image from 'next/image';
import React from 'react';
import { formatRelativeTime } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const ProductCard = ({ content }: { content: any }) => {
  const router = useRouter();

  return (
    <Card
      onClick={() => router.push(`/item/${content.id}`)}
      className="cursor-pointer space-y-3 overflow-hidden p-1 shadow-md md:w-full"
    >
      <Image
        src={content?.images[0] || '/job.jpg'}
        alt={content.name || 'image'}
        className="h-[100px] rounded-t-md object-cover sm:w-full md:h-[150px] xl:h-[200px]"
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
            {content.address.street}, {content.address.city}
          </span>
        </Text>

        <Text className="font-medium" as="p">
          <span className="text-xs font-light text-accent-foreground sm:text-sm">
            {formatRelativeTime(new Date(content.createdAt))}
          </span>
        </Text>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
