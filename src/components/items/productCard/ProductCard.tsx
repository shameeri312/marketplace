/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Card, CardContent } from '@/components/ui/card';
import { IoMdHeartEmpty } from 'react-icons/io';
import { Title } from '@/components/ui/title';
import { useRouter } from 'next/navigation';
import { Text } from '@/components/ui/text';
import Image from 'next/image';
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface ProductCardProps {
  content: any;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
}

const ProductCard = ({
  content,
  isSelectable = false,
  isSelected = false,
  onSelect,
}: ProductCardProps) => {
  const router = useRouter();

  const image = content?.image1 ?? '/uploads/default.jpg';

  return (
    <Card
      onClick={() => router.push(`/item/${content._id}`)}
      className="relative w-[250px] cursor-pointer space-y-3 overflow-hidden p-1 shadow-md md:w-full"
    >
      <div className="relative">
        {/* Checkbox for selection */}
        {isSelectable && (
          <div
            className="absolute left-2 top-2 z-10"
            onClick={(e) => e.stopPropagation()} // Prevent card navigation on checkbox click
          >
            <Checkbox checked={isSelected} onCheckedChange={onSelect} />
          </div>
        )}
        <div className="absolute right-2 top-2 flex items-end gap-1">
          {content?.rent && (
            <Badge
              className="w-max border-none bg-gradient-to-r from-yellow-500 to-orange-600 uppercase text-white"
              variant="outline"
            >
              For Rent
            </Badge>
          )}
          {content?.exchange && (
            <Badge
              className="border-none bg-gradient-to-r from-yellow-500 to-orange-600 uppercase text-white"
              variant="outline"
            >
              For Exchange
            </Badge>
          )}
        </div>

        <Image
          src={image || '/uploads/default.jpg'}
          alt="product image"
          className="h-[120px] rounded-t-md object-cover sm:w-full md:h-[150px] xl:h-[200px]"
          width={400}
          height={200}
        />
      </div>

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
          className="truncate capitalize text-secondary-foreground"
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
            {content?.created_at || 'a while ago'}
          </span>
        </Text>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
