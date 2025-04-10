/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState } from 'react';
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
import Loading from '@/components/loading/Loading';
import { loginInSchema } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Link from 'next/link';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import axios from 'axios';

const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof loginInSchema>>({
    resolver: zodResolver(loginInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Validate email  input pattern

  async function onSubmit(values: z.infer<typeof loginInSchema>) {
    setLoading(true);

    const credentials = {
      email: values.email,
      password: values.password,
    };

    const url = `/api/signin/`; // URL to get the token

    try {
      const res = await axios.post(url, credentials, {
        headers: {
          'Content-Type': 'application/json', // Axios adds this by default for JSON
        },
      });

      if (res.status === 201) {
        const user = res.data.user;

        const credentials = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          token: res.data.token,
          image: user.image,
        };

        console.log('Response:', credentials);

        const result = await signIn('credentials', {
          redirect: false,
          ...credentials,
        });

        if (result?.ok) {
          if (result.error) {
            setLoading(false);
            toast.error('Error logging in!');
          } else {
            toast.success('Logged in successfully!');
          }
        } else {
          toast.error('Error during login');
          setLoading(false);
        }
      }

      // Handle the response
    } catch (error: any) {
      toast.error(error.response.data.error);

      // Handle errors
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* forms */}
      <Form {...form}>
        <form
          autoComplete="off"
          className="mx-auto flex w-full flex-col items-start gap-2 sm:gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          {/* Email  Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email </FormLabel>
                <FormControl>
                  <Input
                    className="w-full rounded-lg"
                    autoComplete="new-email"
                    placeholder="Enter your email "
                    {...field}
                  />
                </FormControl>
                <FormMessage className="dark:text-red-500" />
              </FormItem>
            )}
          />

          {/* Password Field */}
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
                <FormMessage className="dark:text-red-500" />
              </FormItem>
            )}
          />

          <Button
            variant={'link'}
            className="px-0 font-light underline"
            size={'sm'}
          >
            <Link href="/forgot-password">Forgot password?</Link>
          </Button>

          {/* Submit Button */}
          <Button
            className="w-full disabled:bg-zinc-300"
            disabled={loading}
            type="submit"
          >
            {loading ? <Loading /> : 'Login'}
          </Button>
        </form>
      </Form>
    </>
  );
};
export default SignIn;
