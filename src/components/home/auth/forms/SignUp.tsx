/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useCallback, useState } from 'react';
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
import Loading from '@/components/loading/Loading';
import { toast } from 'sonner';
import axios from 'axios';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

// Validation schema
const signUpSchema = z
  .object({
    firstname: z.string().nonempty('First name is required'),
    lastname: z.string().nonempty('Last name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    password2: z
      .string()
      .min(6, 'Password confirmation must be at least 6 characters'),
  })
  .superRefine(({ password2, password }, ctx) => {
    if (password2 !== password) {
      ctx.addIssue({
        code: 'custom',
        message: 'The passwords did not match',
        path: ['password2'],
      });
    }
  });

const SignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );
  // Initialize form with validation schema
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      password2: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setLoading(true);

    const credentials = {
      first_name: values.firstname,
      last_name: values.lastname,
      email: values.email,
      password: values.password,
      password2: values.password2,
    };

    const url = `${process.env.API_URL_PREFIX}/api/user/sign-up/`; // URL to get the token

    try {
      const res = await axios.post(url, credentials, {
        headers: {
          'Content-Type': 'application/json', // Axios adds this by default for JSON
        },
      });

      if (res.status === 200) {
        if (res.data.created) {
          toast.success('Sign up successfull!');
          router.push(pathname + '?' + createQueryString('auth', 'sign-in'));
        } else {
          toast.error(res.data.message);
        }

        console.log('Response:', res.data);
      }
      // Handle the response
    } catch (error: any) {
      toast.error('Sign up failed!');

      // Handle errors
      console.error(
        'Error:',
        error.response ? error.response.data : error.message
      );
    }
    setLoading(false);
  }

  return (
    <>
      <Form {...form}>
        <form
          autoComplete="off"
          className="mx-auto flex w-full flex-col items-start gap-2 sm:gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    className="w-full rounded-lg"
                    placeholder="Enter your first name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastname"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    className="w-full rounded-lg"
                    placeholder="Enter your last name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    className="w-full rounded-lg"
                    placeholder="Enter your email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="w-full rounded-lg"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="password2"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    autoComplete="new-password"
                    className="w-full rounded-lg"
                    placeholder="Confirm your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            className="w-full disabled:bg-zinc-300"
            disabled={loading}
            type="submit"
          >
            {loading ? <Loading /> : 'Sign Up'}
          </Button>
        </form>
      </Form>
    </>
  );
};

export default SignUp;
