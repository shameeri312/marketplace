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

const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof loginInSchema>>({
    resolver: zodResolver(loginInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  // Validate email or username input pattern
  const handleUsernameEmailChange = (value: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmail(emailPattern.test(value));
  };

  // Submission function
  async function onSubmit(values: z.infer<typeof loginInSchema>) {
    setLoading(true);
    const credentials = {
      email: isEmail ? values.email : null,
      username: isEmail ? null : values.email,
      password: values.password,
    };
    localStorage.setItem('email', values.email);

    try {
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
    } catch (error) {
      setLoading(false);
      console.error('Error during login', error);
      toast.error('An error occurred during login.');
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
          {/* Email or Username Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input
                    className="w-full rounded-lg"
                    placeholder="Enter your email or username"
                    {...field}
                    onChange={(e) => {
                      handleUsernameEmailChange(e.target.value);
                      field.onChange(e);
                    }}
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
