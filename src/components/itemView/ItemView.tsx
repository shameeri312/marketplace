/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loading from '../loading/Loading'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Lock, LogIn, MapPin, MessageSquareText, Pencil } from 'lucide-react'
import { Text } from '../ui/text'
import { Separator } from '../ui/separator'
import { Button } from '../ui/button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import ProductCard from '../items/productCard/ProductCard'

const ItemView = ({ id }: { id: any }) => {
  const [items, setItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [item, setItem] = useState<any>(null)
  const [chatName, setChatName] = useState<string>('')
  const { data: session }: any = useSession()
  const [currentImage, setCurrentImage] = useState<string>(
    '/uploads/default.jpg'
  )
  const [isCompareDialogOpen, setIsCompareDialogOpen] = useState<boolean>(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    function generateChatroomName(user1Id: string, user2Id: string): string {
      // Sort the IDs to ensure consistency (e.g., user1Id_user2Id is the same as user2Id_user1Id)
      const sortedIds = [user1Id, user2Id].sort()
      return `chat_${sortedIds[0]}_${sortedIds[1]}`
    }

    const chatroomName = generateChatroomName(
      item?.user?._id,
      session?.user?.id
    )
    setChatName(chatroomName) // Output: "chat_12345_67890"
  }, [item?.user?._id, session?.user])

  useEffect(() => {
    ;(async () => {
      try {
        const url = `/api/items/${id}/`
        const res = await axios.get(url)

        if (res.status === 200) {
          setItem(res.data)

          setCurrentImage(res.data?.image1)

          setSelectedItems([res.data._id])

          setIsLoading(false)
        }
      } catch (error: any) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    })()
    ;(async () => {
      try {
        const url = `/api/items/`
        const res = await axios.get(url)

        if (res.status === 200) {
          setItems(res.data)
        }
      } catch (error: any) {
        console.log(error)
      }
    })()
  }, [id])

  // Get selected items for comparison
  useEffect(() => {
    if (selectedItems.length === 2) {
      setIsCompareDialogOpen(true)
    } else {
      setIsCompareDialogOpen(false)
    }
  }, [selectedItems])

  const handleSelectItem = (itemId: string) => {
    setSelectedItems((prev) => {
      if (prev.includes(itemId)) {
        return prev.filter((id) => id !== itemId)
      }
      if (prev.length >= 2) {
        return prev // Limit to 2 items
      }
      return [...prev, itemId]
    })
  }

  const displayedItems = items.filter((xy) => {
    // Existing conditions: item must be available for exchange and not the current item
    if (!xy.exchange || item?._id === xy._id) return false

    // Match price (if both items have price) or salary (if both have salary)
    if (item?.price && xy.price) {
      return item.price === xy.price
    }

    return false
  })
  const compareItems = [
    item && selectedItems.includes(item._id) ? item : null,
    ...items.filter(
      (it) => selectedItems.includes(it._id) && it._id !== item?._id
    ),
  ].filter(Boolean)

  return isLoading ? (
    <Loading /> // Display the loading component when isLoading is true
  ) : item ? (
    <div className="flex flex-col gap-4">
      <div className="grid gap-2 p-4 md:grid-cols-2 lg:gap-4">
        <div>
          <div className="relative h-max rounded-xl border bg-secondary">
            <div className="absolute right-2 top-2 flex items-end gap-1">
              {item?.rent && (
                <Badge
                  className="h-8 border-none bg-gradient-to-r from-yellow-500 to-orange-600 px-4 uppercase text-white"
                  variant="outline"
                >
                  For Rent
                </Badge>
              )}
              {item?.exchange && (
                <Badge
                  className="h-8 border-none bg-gradient-to-r from-yellow-500 to-orange-600 px-4 uppercase text-white"
                  variant="outline"
                >
                  For Exchange
                </Badge>
              )}
            </div>

            <Image
              src={currentImage}
              width={300}
              height={300}
              className="h-[300px]  w-full rounded-xl object-contain sm:h-[400px] lg:h-[500px]"
              alt={item?.adTitle || 'image_preview'}
            />
          </div>

          <div className="flex justify-center gap-3 py-2">
            {[item?.image1, item?.image2, item?.image3].map(
              (image: string, index: number) =>
                image ? (
                  <button onClick={() => setCurrentImage(image)} key={index}>
                    <Image
                      src={image ?? '/uploads/default.jpg'}
                      width={100}
                      height={100}
                      className={`size-16 sm:size-20 rounded-md border-2 ${image === currentImage ? 'border-primary brightness-75' : 'border-black/50'} bg-secondary object-cover shadow-lg`}
                      alt={item?.adTitle || 'image_preview'}
                    />
                  </button>
                ) : (
                  <span key={index}></span>
                )
            )}
            <button></button>
          </div>
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
            <h2 className="text-lg font-semibold capitalize lg:text-xl">
              Location
            </h2>
            <Separator />

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
            <h2 className="text-lg font-semibold capitalize lg:text-xl">
              Uploaded by
            </h2>
            {session?.user?.id !== item?.user?._id ? (
              <>
                <Separator />
                <div className="flex w-full items-start gap-2">
                  <Image
                    src={item?.user?.photo ?? '/profilePictures/profile.png'}
                    alt="user"
                    width={100}
                    height={100}
                    className=" h-12  w-12 object-cover overflow-hidden rounded-full"
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

                    {session?.user ? (
                      <Link
                        href={
                          '/chat/' +
                          chatName +
                          '?user=' +
                          item?.user?.firstName +
                          ' ' +
                          item?.user?.lastName
                        }
                      >
                        <Button
                          variant={'default'}
                          onClick={() => {
                            localStorage.setItem(
                              'chat_name',
                              item?.user?.firstName + ' ' + item?.user?.lastName
                            )
                          }}
                          size={'sm'}
                        >
                          <MessageSquareText />
                          Chat
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant={'outline'}
                        onClick={() => {
                          localStorage.setItem(
                            'chat_name',
                            item?.user?.firstName + ' ' + item?.user?.lastName
                          )
                        }}
                        size={'sm'}
                      >
                        <Lock />
                        Login to chat
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>You</>
            )}
          </div>
        </div>
      </div>

      {item?.exchange && (
        <div className="space-y-4 bg-neutral-100 lg:p-6 p-4 rounded-3xl">
          <h2 className="text-lg font-semibold capitalize lg:text-xl">
            Other Items For Exhange
          </h2>
          {displayedItems.length > 0 ? (
            <>
              <Separator />

              <div className="grid sm:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {displayedItems.map((content: any, index: number) => (
                  <div key={index}>
                    <ProductCard
                      content={content}
                      isSelectable={true}
                      isSelected={selectedItems.includes(content._id)}
                      onSelect={() => handleSelectItem(content._id)}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-2 text-secondary-foreground">
              No items available for Exhange
            </p>
          )}
        </div>
      )}

      {/* item compare dialog */}
      <Dialog open={isCompareDialogOpen} onOpenChange={setIsCompareDialogOpen}>
        <DialogContent className="h-[99vh] overflow-y-auto sm:h-max sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              Compare Mobile Phones
            </DialogTitle>
          </DialogHeader>
          <Separator />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:p-4">
            {compareItems.map((item) => {
              return (
                <div key={item._id} className="flex flex-col space-y-4">
                  <h3 className="text-lg font-semibold">
                    {item.adTitle || item.name || 'Untitled Item'}
                  </h3>
                  <div className="flex justify-center">
                    {item.image1 || item.image2 || item.image3 ? (
                      <Image
                        src={item.image1 || item.image2 || item.image3}
                        alt={item.adTitle || item.name || 'Item image'}
                        width={200}
                        height={200}
                        className="h-40 w-full rounded-lg object-cover shadow-lg sm:h-48 md:h-52"
                      />
                    ) : (
                      <div className="flex h-48 w-48 items-center justify-center rounded-md bg-gray-200">
                        <span className="text-gray-500">No image</span>
                      </div>
                    )}
                  </div>

                  <Table className="w-full border text-sm">
                    <TableBody>
                      <TableRow>
                        <TableCell className="pr-2 font-bold">Price:</TableCell>
                        <TableCell>
                          {item.price && item.currency
                            ? `${item.currency} ${item.price.toFixed(2)}`
                            : item.salary && item.currency
                              ? `${item.currency} ${item.salary}`
                              : 'N/A'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pr-2 font-bold">
                          Description:
                        </TableCell>
                        <TableCell>
                          {item.description || 'No description available'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pr-2 font-bold">
                          Category:
                        </TableCell>
                        <TableCell>{item.category || 'N/A'}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="pr-2 font-bold">
                          Seller:
                        </TableCell>
                        <TableCell>
                          {item.userDetails?.firstName &&
                          item.userDetails?.lastName
                            ? `${item.userDetails.firstName} ${item.userDetails.lastName}`
                            : 'Unknown'}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              )
            })}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCompareDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    <>Not Found</>
  )
}

export default ItemView
