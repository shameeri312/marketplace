'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Loading from '../loading/Loading';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Trash } from 'lucide-react';
import { Title } from '../ui/title';

const AddedItems = () => {
  const { data: session }: any = useSession();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  useEffect(() => {
    const token = session?.user?.token;
    console.log('Token:', token);

    const fetchItems = async () => {
      try {
        const url = `/api/addedBy/${session?.user?.id}`;
        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setItems(res.data);
          console.log('All Items:', res.data);
        }
      } catch (error: any) {
        console.log('Error fetching items:', error);
        toast.error('Failed to fetch items');
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchItems();
    }
  }, [session?.user]);

  const handleDelete = async () => {
    if (!selectedItemId) return;

    try {
      const token = session?.user?.token;
      const res = await axios.delete(`/api/items/${selectedItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 204 || res.status === 200) {
        setItems(items.filter((item) => item._id !== selectedItemId));
        toast.success('Item deleted successfully');
        setIsDialogOpen(false);
        setSelectedItemId(null);
      }
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const openDeleteDialog = (itemId: string) => {
    setSelectedItemId(itemId);
    setIsDialogOpen(true);
  };

  return isLoading ? (
    <Loading />
  ) : (
    <Card className="mx-auto h-[calc(100vh_-_150px)] max-w-4xl flex-1 overflow-y-auto bg-secondary/70 p-4">
      <Title className="pb-2">Your Listings</Title>
      {items.length > 0 ? (
        <div className="flex flex-col space-y-4">
          {items.map((item) => (
            <div
              key={item._id}
              className="flex flex-row items-center rounded-lg bg-white p-4 shadow-md"
            >
              {/* Image */}
              <div className="border">
                {item.image1 || item.image2 || item.image3 ? (
                  <Image
                    src={item.image1 || item.image2 || item.image3}
                    alt={item.adTitle || 'Item image'}
                    width={150}
                    height={150}
                    className="h-24 w-24 rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-md bg-gray-200">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between px-4">
                <div>
                  <CardTitle className="truncate text-lg font-semibold">
                    {item.adTitle || 'Untitled Item'}
                  </CardTitle>
                  <p className="mt-2 text-sm font-medium">
                    {item.price && item.currency
                      ? `${item.currency} ${item.price.toFixed(2)}`
                      : 'Price not specified'}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Category: {item.category || 'N/A'}
                  </p>
                </div>
              </div>

              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    onClick={() => openDeleteDialog(item._id)}
                    className="ml-auto self-start"
                    size={'icon'}
                  >
                    <Trash />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delete Item</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this item? This action
                      cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setSelectedItemId(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete}>
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No items found.</p>
      )}
    </Card>
  );
};

export default AddedItems;
