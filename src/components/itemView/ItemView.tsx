/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/Loading';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { MapPin, MessageSquareText, Pencil } from 'lucide-react';
import { Text } from '../ui/text';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const ItemView = ({ id }: { id: any }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [item, setItem] = useState<any>(null);
  const [chatName, setChatName] = useState<string>('');
  const { data: session }: any = useSession();

  useEffect(() => {
    function generateChatroomName(user1Id: string, user2Id: string): string {
      // Sort the IDs to ensure consistency (e.g., user1Id_user2Id is the same as user2Id_user1Id)
      const sortedIds = [user1Id, user2Id].sort();
      return `chat_${sortedIds[0]}_${sortedIds[1]}`;
    }

    const chatroomName = generateChatroomName(
      item?.user?._id,
      session?.user?.id
    );
    setChatName(chatroomName); // Output: "chat_12345_67890"
  }, [item?.user?._id, session?.user]);

  useEffect(() => {
    (async () => {
      try {
        const url = `/api/items/${id}/`;
        const res = await axios.get(url);

        if (res.status === 200) {
          setItem(res.data);

          console.log(res.data);

          setIsLoading(false);
        }
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id]);

  console.log('Item: ', item);

  return isLoading ? (
    <Loading /> // Display the loading component when isLoading is true
  ) : item ? (
    <div className="grid gap-2 p-4 md:grid-cols-2">
      <div className="rounded-xl border bg-secondary shadow-lg">
        <Image
          src={item?.image1 ?? '/uploads/default.jpg'}
          width={300}
          height={300}
          className="h-[300px] w-full rounded-xl object-contain sm:h-[400px] lg:h-[500px]"
          alt={item?.adTitle || 'image_preview'}
        />
      </div>
      <div className="flex flex-col items-start gap-3 rounded-xl">
        <div className="flex w-full flex-col items-start gap-3 rounded-xl border p-4">
          <div className="flex w-full justify-between">
            <Badge>{item?.category}</Badge>
            {item.user._id === session?.user?.id && (
              <Link href={`/edit/${item?._id}`}>
                <Button size={'sm'} className="h-6 self-end" variant={'link'}>
                  <Pencil /> Edit
                </Button>
              </Link>
            )}
          </div>
          <h2 className="text-2xl font-bold capitalize sm:text-3xl lg:text-4xl">
            {item?.adTitle}
          </h2>

          <div>
            <span className="text-muted-foreground">Description</span>
            <p>{item?.description}</p>
          </div>

          <Separator />

          <Text className="font-semibold" as="p">
            <span className="text-accent-foreground">
              {item?.price || item?.salary} {item?.currency}{' '}
            </span>
          </Text>
        </div>

        <div className="flex w-full flex-col items-start gap-3 rounded-xl border p-4">
          <h2 className="text-xl font-semibold capitalize lg:text-2xl">
            Location
          </h2>

          <div className="flex items-center gap-1">
            <p>
              <MapPin size={16} />
            </p>

            <p>
              {item?.street}, {item?.city}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col items-start gap-3 rounded-xl border p-4">
          <h2 className="text-xl font-semibold capitalize">Uploaded by</h2>
          <Separator />
          <div className="flex w-full items-start gap-2">
            <Image
              src={item?.user?.photo ?? '/profilePictures/profile.png'}
              alt="user"
              width={100}
              height={100}
              className="h-12 w-12 overflow-hidden rounded-full"
            />

            <div className="flex w-[calc(100%_-_70px)] items-center justify-between">
              <div>
                <h2 className="text-base font-semibold capitalize">
                  {item?.user?.firstName}
                  {item?.user?.lastName}
                </h2>
                <button className="border-b border-primary text-xs text-primary">
                  View profile
                </button>
              </div>

              <Link href={'/chat/' + chatName}>
                <Button
                  variant={'default'}
                  onClick={() => {
                    localStorage.setItem(
                      'chat_name',
                      item?.user?.firstName + ' ' + item?.user?.lastName
                    );
                  }}
                  size={'sm'}
                >
                  <MessageSquareText />
                  Chat
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <>Not Found</>
  );
};

export default ItemView;
