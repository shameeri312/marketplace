/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import ProductCard from '@/components/items/productCard/ProductCard'
import Loading from '@/components/loading/Loading'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FcEmptyTrash } from 'react-icons/fc'

const ItemsByCategory = ({ category }: { category: string }) => {
  const [items, setItems] = useState<any[]>([])
  const params = useSearchParams()
  const searchParamQuery = params.get('query') || ''
  const searchCategoryParam = params.get('category') || ''
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchCategoryParam ? searchCategoryParam.split(',') : []
  )
  const [query, setQuery] = useState<string>(searchParamQuery)
  const [visibleItems, setVisibleItems] = useState<number>(9)

  useEffect(() => {
    // Update query and selected categories whenever URL params change
    setQuery(searchParamQuery)
    setSelectedCategories(
      searchCategoryParam ? searchCategoryParam.split(',') : []
    )
    if (query) {
      setSelectedCategories([])
    }
  }, [searchParamQuery, searchCategoryParam])

  useEffect(() => {
    // Simulate filtering process
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [searchParamQuery, searchCategoryParam, query])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const url = `/api/category/${category}`
        const res = await fetch(url)

        if (res.status === 200) {
          const data = await res.json()
          console.log('Fetched Items:', data) // Debug: Log fetched items
          setItems(data)
        }
      } catch (error: any) {
        console.log('Error fetching items:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchItems()
  }, [category])

  // Filter items based on selected categories and query
  const filteredItems = items.filter((item: any) => {
    const matchesCategory = selectedCategories.length
      ? selectedCategories.some((selectedCategory) =>
          Array.isArray(item.category)
            ? item.category.some(
                (cat: any) =>
                  cat.toLowerCase() === selectedCategory.toLowerCase()
              )
            : item.category.toLowerCase() === selectedCategory.toLowerCase()
        )
      : true

    const matchesQuery = query
      ? item.keywords &&
        (typeof item.keywords === 'string'
          ? item.keywords
              .split(',')
              .map((k: string) => k.trim())
              .some((keyword: string) =>
                keyword.toLowerCase().includes(query.toLowerCase())
              )
          : Array.isArray(item.keywords)
            ? item.keywords.some((keyword: string) =>
                keyword.toLowerCase().includes(query.toLowerCase())
              )
            : false)
      : true

    return matchesCategory && matchesQuery
  })

  // Get items to display based on "Load More" pagination
  const displayedItems = filteredItems.slice(0, visibleItems)

  // Load more items
  const loadMore = () => {
    setVisibleItems((prev) => prev + 9)
  }

  // Determine if there are no results for the category or query
  const noResultsMessage =
    (selectedCategories.length > 0 && filteredItems.length === 0) ||
    (query.length > 0 && filteredItems.length === 0)

  return (
    <div className="h-full rounded-md bg-secondary/70 p-2 md:p-4">
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Item Grid */}
          {displayedItems.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {displayedItems.map((content: any, index: number) => (
                <div key={index}>
                  <ProductCard content={content} isSelectable={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid h-full w-full place-content-center">
              {noResultsMessage && (
                <>
                  <FcEmptyTrash className="mx-auto size-16" />
                  <Text className="text-sm">
                    No items found for{' '}
                    <b>
                      {query
                        ? `query: ${query}`
                        : `category: ${selectedCategories.join(', ')}`}
                    </b>
                  </Text>
                </>
              )}
            </div>
          )}

          <div className="flex justify-center">
            {/* Load More Button */}
            {visibleItems < filteredItems.length && (
              <Button
                className="mx-auto my-4"
                variant={'outline'}
                onClick={loadMore}
              >
                Load More
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ItemsByCategory
