/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Title } from '@/components/ui/title';
import { IoMdHeartEmpty, IoMdHeart } from 'react-icons/io';
import Image from 'next/image';
import React from 'react';
import { formatRelativeTime } from '@/lib/utils';

const ProductCard = ({ content }: { content: any }) => {
  return (
    <Card className="w-[270px] space-y-3 overflow-hidden p-1 sm:w-[300px] md:w-full">
      <Image
        src={content.images[0]}
        alt={content.name}
        className="h-[150px] rounded-t-md object-cover sm:h-[200px] sm:w-full"
        width={400}
        height={200}
      />
      <CardContent>
        <div className="flex items-center justify-between">
          <Text className="font-medium" as="p">
            <span className="text-accent-foreground">
              {content.price} {content.currency}{' '}
            </span>
          </Text>

          <IoMdHeartEmpty className="size-5" />
        </div>
        <Title
          size="sm"
          className="catpitalize text-secondary-foreground"
          as="h6"
        >
          {content.name}
        </Title>
        <Text className="font-medium" as="p">
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
