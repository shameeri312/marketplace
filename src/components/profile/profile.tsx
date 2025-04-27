/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Title } from '@/components/ui/title';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Define the form schema
const formSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  phoneNo: z.string().optional(),
  photo: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      'Image must be less than 5MB'
    )
    .refine(
      (file) =>
        !file || ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
      'Image must be JPEG, PNG, or GIF'
    ),
  city: z.string().optional(),
  country: z.string().optional(),
  about: z.string().max(1024, 'About cannot exceed 1024 characters').optional(),
  gender: z.enum(['Male', 'Female', 'Other']).optional(),
  dateOfBirth: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid date format'),
});

type FormData = z.infer<typeof formSchema>;

const Profile = () => {
  const { data: session }: any = useSession();
  const [loading, setLoading] = React.useState(false);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      phoneNo: '',
      city: '',
      country: 'Pakistan',
      about: '',
      gender: undefined,
      dateOfBirth: '',
    },
  });

  // Populate form with user data from session
  useEffect(() => {
    if (session?.user) {
      form.reset({
        email: session.user.email || '',
        firstName: session.user.firstName || '',
        lastName: session.user.lastName || '',
        phoneNo: session.user.phoneNo || '',
        city: session.user.city || '',
        country: session.user.country || 'Pakistan',
        about: session.user.about || '',
        gender: session.user.gender || undefined,
        dateOfBirth: session.user.dateOfBirth
          ? new Date(session.user.dateOfBirth).toISOString().split('T')[0]
          : '',
      });
    }
  }, [session, form]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === 'photo' && value instanceof File) {
            formData.append('photo', value);
          } else if (key === 'dateOfBirth' && value) {
            formData.append(key, new Date(value).toISOString());
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await axios.put('/api/user', formData, {
        headers: {
          Authorization: `Bearer ${session?.user?.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Profile updated:', response.data);
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(
        'Failed to update profile: ' + error.response?.data?.error ||
          error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-2xl bg-secondary/70 p-4">
      <CardHeader>
        <CardTitle className="font-semibold">Update Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Text>Email</Text>
              <Input
                {...form.register('email')}
                type="email"
                placeholder="Enter your email"
                className="mt-1"
              />
              {form.formState.errors.email && (
                <Text className="text-red-500">
                  {form.formState.errors.email.message}
                </Text>
              )}
            </div>

            <div>
              <Text>First Name</Text>
              <Input
                {...form.register('firstName')}
                placeholder="Enter your first name"
                className="mt-1"
              />
              {form.formState.errors.firstName && (
                <Text className="text-red-500">
                  {form.formState.errors.firstName.message}
                </Text>
              )}
            </div>

            <div>
              <Text>Last Name</Text>
              <Input
                {...form.register('lastName')}
                placeholder="Enter your last name"
                className="mt-1"
              />
              {form.formState.errors.lastName && (
                <Text className="text-red-500">
                  {form.formState.errors.lastName.message}
                </Text>
              )}
            </div>

            <div>
              <Text>Phone Number</Text>
              <Input
                {...form.register('phoneNo')}
                placeholder="Enter your phone number"
                className="mt-1"
              />
              {form.formState.errors.phoneNo && (
                <Text className="text-red-500">
                  {form.formState.errors.phoneNo.message}
                </Text>
              )}
            </div>

            <div>
              <Text>Profile Photo</Text>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/gif"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    form.setValue('photo', file);
                  }
                }}
                className="mt-1"
              />
              {form.formState.errors.photo && (
                <Text className="text-red-500">
                  {form.formState.errors.photo.message}
                </Text>
              )}
            </div>

            <div>
              <Text>City</Text>
              <Input
                {...form.register('city')}
                placeholder="Enter your city"
                className="mt-1"
              />
              {form.formState.errors.city && (
                <Text className="text-red-500">
                  {form.formState.errors.city.message}
                </Text>
              )}
            </div>

            <div>
              <Text>Country</Text>
              <Input
                {...form.register('country')}
                placeholder="Enter your country"
                className="mt-1"
              />
              {form.formState.errors.country && (
                <Text className="text-red-500">
                  {form.formState.errors.country.message}
                </Text>
              )}
            </div>

            <div>
              <Text>Gender</Text>
              <Select {...form.register('gender')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.gender && (
                <Text className="text-red-500">
                  {form.formState.errors.gender.message}
                </Text>
              )}
            </div>

            <div>
              <Text>Date of Birth</Text>
              <Input
                {...form.register('dateOfBirth')}
                type="date"
                className="mt-1"
              />
              {form.formState.errors.dateOfBirth && (
                <Text className="text-red-500">
                  {form.formState.errors.dateOfBirth.message}
                </Text>
              )}
            </div>
          </div>
          <div>
            <Text>About</Text>
            <textarea
              {...form.register('about')}
              placeholder="Tell us about yourself"
              className="mt-1 w-full rounded-md border p-2"
              rows={4}
            />
            {form.formState.errors.about && (
              <Text className="text-red-500">
                {form.formState.errors.about.message}
              </Text>
            )}
          </div>

          <Button type="submit" className="mt-4">
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default Profile;
