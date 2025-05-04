/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import axios from 'axios'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { RefreshCcw, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { Checkbox } from '@/components/ui/checkbox'

const postAdSchema = z.object({
  adTitle: z.string().min(5, 'Ad title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  street: z.string().nonempty('Street is required'),
  currency: z.string().optional(),
  city: z.string().nonempty('City is required'),
  state: z.string().nonempty('State is required'),
  postalCode: z.string().nonempty('Postal Code is required'),
  price: z.string().nonempty('Price is required'),
  name: z.string().nonempty('Name is required'),
  phoneNumber: z.string().regex(/^\+?\d{10,15}$/, 'Enter a valid phone number'),
  selectedCategory: z.string().nonempty('Category is required'),
  keywords: z.string().optional(),
  images: z.array(z.instanceof(File)).optional(),
  rent: z.boolean().optional(),
  exchange: z.boolean().optional(),
})

const AddItemForm = ({
  selectedCategory,
  selectedSubCategories,
}: {
  selectedCategory: string
  selectedSubCategories: string[]
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const { data: session }: any = useSession()
  const router = useRouter()
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [keywordsLoading, setKeywordsLoading] = useState<boolean>(false)

  const form = useForm<z.infer<typeof postAdSchema>>({
    resolver: zodResolver(postAdSchema),
    defaultValues: {
      adTitle: '',
      description: '',
      currency: 'PKR',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      price: '',
      name: '',
      phoneNumber: '',
      selectedCategory: selectedCategory,
      keywords: '',
      images: [],
      rent: false,
      exchange: false,
    },
    mode: 'onChange',
  })

  useEffect(() => {
    form.setValue('selectedCategory', selectedCategory)

    // Get current keywords from the form
    const currentKeywords = form.getValues('keywords') || ''
    // Split existing keywords into an array, removing empty strings
    const currentKeywordsArray = currentKeywords
      .split(',')
      .map((kw) => kw.trim())
      .filter((kw) => kw.length > 0)

    // Combine existing keywords with selectedSubCategories, removing duplicates
    const combinedKeywords = Array.from(
      new Set([...currentKeywordsArray, ...selectedSubCategories])
    )

    // Update keywords field with combined keywords
    form.setValue('keywords', combinedKeywords.join(', '))
  }, [form, selectedCategory, selectedSubCategories])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3) // Limit to 3 images
    setSelectedImages(files)
    setImagePreviews(files.map((file) => URL.createObjectURL(file)))
    form.setValue('images', files) // Update form state with selected files
  }

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index)
    setSelectedImages(updatedImages)
    setImagePreviews(updatedImages.map((file) => URL.createObjectURL(file)))
    form.setValue('images', updatedImages) // Update form state
  }

  const generateKeywords = async () => {
    setKeywordsLoading(true)
    const adTitle = form.getValues('adTitle')
    const category = form.getValues('selectedCategory')
    const name = form.getValues('name')

    // Trigger validation for the relevant fields
    const isValid = await form.trigger(['adTitle', 'selectedCategory', 'name'])

    if (!isValid) {
      toast.error(
        'Please fill in Ad Title, Category, and Name before generating keywords.'
      )
      return
    }

    try {
      const response = await axios.post('/api/genai/generate-keywords', {
        title: adTitle,
        category,
        name,
      })

      const keywords = response.data.keywords

      if (keywords && Array.isArray(keywords)) {
        // Get current keywords from the form
        const currentKeywords = form.getValues('keywords') || ''

        // Split existing keywords into an array, removing empty strings
        const currentKeywordsArray = currentKeywords
          .split(',')
          .map((kw) => kw.trim())
          .filter((kw) => kw.length > 0)

        // Combine existing keywords with selectedSubCategories, removing duplicates
        const combinedKeywords = Array.from(
          new Set([...currentKeywordsArray, ...keywords])
        )

        // Update keywords field with combined keywords
        form.setValue('keywords', combinedKeywords.join(', '))

        toast.success('Keywords generated successfully!')
      } else {
        toast.error('No keywords generated.')
      }
    } catch (error: any) {
      console.error('Error generating keywords:', error)
      toast.error(
        'Failed to generate keywords: ' +
          (error.response?.data?.error || error.message)
      )
    } finally {
      setKeywordsLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof postAdSchema>) {
    setLoading(true)
    const token = session?.user?.token

    // Create FormData to send files and other fields
    const formData = new FormData()
    formData.append('adTitle', values.adTitle)
    formData.append('description', values.description)
    formData.append('street', values.street)
    formData.append('currency', values.currency || 'PKR')
    formData.append('city', values.city)
    formData.append('state', values.state)
    formData.append('postalCode', values.postalCode)
    formData.append('price', values.price)
    formData.append('name', values.name)
    formData.append('phoneNumber', values.phoneNumber)
    formData.append('category', values.selectedCategory)
    formData.append('keywords', values.keywords || '')

    // Append rent and exchange
    formData.append('rent', String(values.rent || false))
    formData.append('exchange', String(values.exchange || false))

    // Append images
    values.images?.forEach((image, index) => {
      if (image) formData.append(`image${index + 1}`, image)
    })

    console.log('FormData:', Object.fromEntries(formData)) // Log for debugging (note: files won't be fully visible)

    try {
      const url = `/api/items/`
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.status === 201) {
        toast.success('Ad posted successfully!')
        router.push('/explore')
      }
    } catch (error: any) {
      console.log('Error:', error)
      toast.error(
        'Failed to post ad: ' + (error.response?.data?.error || error.message)
      )
    } finally {
      setLoading(false)
    }
  }

  const formGroupStyles =
    'grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 w-full'
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 bg-white"
      >
        <div className={'flex flex-wrap items-center gap-4'}>
          <FormLabel>Post Type:</FormLabel>
          <FormField
            control={form.control}
            name="rent"
            render={({ field }) => (
              <FormItem className="flex w-max flex-row items-start gap-4 space-y-0 rounded-md border border-input p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">For Rent</FormLabel>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exchange"
            render={({ field }) => (
              <FormItem className="flex w-max flex-row items-start gap-4 space-y-0 rounded-md border border-input p-3">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="cursor-pointer">For Exchange</FormLabel>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className={formGroupStyles}>
          <FormField
            control={form.control}
            name="selectedCategory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input readOnly className="w-full bg-gray-100" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ad Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={formGroupStyles}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-end gap-2">
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Add keywords separated by (,)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            size={'icon'}
            onClick={generateKeywords}
            variant={'secondary'}
          >
            <RefreshCcw className={`${keywordsLoading && 'animate-spin'}`} />
          </Button>
        </div>

        <div className={formGroupStyles}>
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={formGroupStyles}>
          <FormField
            control={form.control}
            name="street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Street</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter City</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className={formGroupStyles}>
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter State</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Postal Code</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Image Upload */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <div className="flex items-center gap-4">
                <FormLabel>Upload Images (Max 3)</FormLabel>
                <label className="flex cursor-pointer items-center gap-4 rounded-lg border border-primary px-2 py-1 text-sm text-primary hover:bg-primary/80 hover:text-primary-foreground">
                  <Upload size={16} /> Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <FormControl>
                <div className="flex flex-col items-start gap-4">
                  <div className="flex gap-4">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={src}
                          alt="Preview"
                          width={64}
                          height={64}
                          className="h-20 w-20 rounded-lg border border-primary object-cover"
                        />
                        <button
                          type="button"
                          className="absolute -right-1 -top-1 rounded-sm bg-red-500 text-white"
                          onClick={() => removeImage(index)}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          {loading ? 'Submitting...' : 'Post Now'}
        </Button>
      </form>
    </Form>
  )
}

export default AddItemForm
