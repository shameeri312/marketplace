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

// Validation schema
const postAdSchema = z.object({
  adTitle: z.string().min(5, 'Ad title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().nonempty('Location is required'),
  price: z.string().nonempty('Price is required'),
  name: z.string().nonempty('Name is required'),
  phoneNumber: z.string().regex(/^\+?\d{10,15}$/, 'Enter a valid phone number'),
  selectedCategory: z.string().nonempty('Category is required'),
});

const AddItemForm = ({ selectedCategory }: { selectedCategory: string }) => {
  const [loading, setLoading] = useState<boolean>(false);
  // Initialize form with validation schema
  const form = useForm<z.infer<typeof postAdSchema>>({
    resolver: zodResolver(postAdSchema),
    defaultValues: {
      adTitle: '',
      description: '',
      location: '',
      price: '',
      name: '',
      phoneNumber: '',
      selectedCategory: selectedCategory,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    console.log(selectedCategory);
    form.reset({
      selectedCategory: selectedCategory,
    });
  }, [selectedCategory]);

  async function onSubmit(values: z.infer<typeof postAdSchema>) {
    setLoading(true);

    const adDetails = {
      adTitle: values.adTitle,
      description: values.description,
      location: values.location,
      price: values.price,
      name: values.name,
      phoneNumber: values.phoneNumber,
      selectedCategory: values.selectedCategory,
    };
    toast(
      <div className="w-full rounded-[4px] border-2 bg-secondary p-2">
        <pre>
          Submitted:
          {JSON.stringify(adDetails, null, 2)}
        </pre>
      </div>
    );
    console.log(adDetails);
    setLoading(false);
  }

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        className="mx-auto flex w-full flex-col items-start gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {/* Selected Category */}
        <FormField
          control={form.control}
          name="selectedCategory"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input
                  readOnly
                  autoComplete="off"
                  className="w-full rounded-lg font-medium text-primary ring-2 ring-primary"
                  placeholder="Select a category"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Ad Title */}
        <FormField
          control={form.control}
          name="adTitle"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ad Title</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  className="w-full rounded-lg"
                  placeholder="Enter the ad title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full rounded-lg"
                  placeholder="Describe the item you’re selling"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  className="w-full rounded-lg"
                  placeholder="Enter the location"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Down Payment */}
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  autoComplete="off"
                  className="w-full rounded-lg"
                  placeholder="Enter the price"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  autoComplete="off"
                  className="w-full rounded-lg"
                  placeholder="Enter your name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone Number */}
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Mobile Phone Number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  autoComplete="off"
                  className="w-full rounded-lg"
                  placeholder="Enter your phone number"
                  {...field}
                />
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
