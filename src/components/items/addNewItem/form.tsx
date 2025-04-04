/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Upload, X } from 'lucide-react';
import Image from 'next/image';

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
  images: z
    .array(z.instanceof(File))
    .min(1, 'At least one image is required')
    .max(3, 'You can upload up to 3 images')
    .optional(),
});

const AddItemForm = ({ selectedCategory }: { selectedCategory: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session }: any = useSession();
  const router = useRouter();
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

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
    },
    mode: 'onChange',
  });

  useEffect(() => {
    form.setValue('selectedCategory', selectedCategory);
  }, [selectedCategory]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3);
    setSelectedImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    form.setValue('images', files);
  };

  const removeImage = (index: number) => {
    const updatedImages = selectedImages.filter((_, i) => i !== index);
    setSelectedImages(updatedImages);
    setImagePreviews(updatedImages.map((file) => URL.createObjectURL(file)));
    form.setValue('images', updatedImages);
  };

  async function onSubmit(values: z.infer<typeof postAdSchema>) {
    setLoading(true);
    const token = session?.user?.token;

    const formData = new FormData();
    formData.append('ad_title', values.adTitle);
    formData.append('description', values.description);
    formData.append('street', values.street);
    formData.append('currency', values.currency || 'PKR');
    formData.append('city', values.city);
    formData.append('state', values.state);
    formData.append('postal_code', values.postalCode);
    formData.append('price', values.price);
    formData.append('name', values.name);
    formData.append('phone_number', values.phoneNumber);
    formData.append('keywords', values.keywords || '');
    formData.append('category', values.selectedCategory);

    console.log(formData);

    values.images?.forEach((image, index) => {
      formData.append(`image${index + 1}`, image);
    });

    try {
      const url = `${process.env.API_URL_PREFIX}/api/items/items/`;
      const res = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 201) {
        toast.success('Ad posted successfully!');
        router.push('/explore');
      }
    } catch (error: any) {
      console.log(error);
      toast.error('Failed to post ad');
    }
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Add keywords separated by (,)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
        {/* -------------------------- */}
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
        {/* ------------------------- */}
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

        {/* ---------------------------- */}
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
        {/* ------------------------------------- */}
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
        {/* ----------------------------------------------- */}
        {/* Image Upload */}
        <FormField
          control={form.control}
          name="images"
          render={() => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel>Upload Images (Max 3)</FormLabel>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-primary px-2 py-1 text-sm text-primary hover:bg-primary/80">
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
                <div className="flex flex-col items-start gap-2">
                  <div className="flex gap-2">
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
  );
};

export default AddItemForm;
