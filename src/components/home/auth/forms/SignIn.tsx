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
import { loginInSchema } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Loading from '@/components/loading/Loading';
import Google from '@/icons/Google';
import { Separator } from '@/components/ui/separator';
import { DialogTitle } from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const SignIn = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmail, setIsEmail] = useState<boolean>(false);

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

  async function onSubmit(values: z.infer<typeof loginInSchema>) {
    setLoading(true);

    const credentials = {
      email: isEmail ? values.email : null,
      username: isEmail ? null : values.email,
      password: values.password,
    };

    console.log(credentials);
  }

  return (
    <>
      <div
        className={
          'mx-auto flex w-[95%] flex-col items-center gap-2 py-5 sm:py-0 md:gap-3'
        }
      >
        <DialogTitle className={'heading-md'}>Sign In</DialogTitle>
        <Text as="p" className="text-center">
          Don&#39;t have an account yet?{' '}
          <span
            onClick={() => {
              router.push(
                pathname + '?' + createQueryString('auth', 'sign-up')
              );
            }}
            className={'cursor-pointer text-blue-500'}
          >
            {' '}
            Sign up here{' '}
          </span>
        </Text>

        <Button size={'lg'} variant={'outline'}>
          <Google /> Sign in with Google
        </Button>

        <div className={'flex w-full items-center gap-5 px-2'}>
          <Separator className={'flex-1'} />
          <span className={'text-secondary-foreground/50'}>OR</span>
          <Separator className={'flex-1'} />
        </div>
        {/* forms */}

        <Form {...form}>
          <form
            autoComplete="off"
            className="mx-auto flex w-full flex-col items-start gap-4"
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
                      autoComplete="off"
                      className="h-12 w-full rounded-lg"
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
                      className="h-12 w-full rounded-lg"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="dark:text-red-500" />
                </FormItem>
              )}
            />

            <Link
              href="/forgot-password"
              className="w-full text-end text-xs underline"
            >
              Forgot password?
            </Link>

            {/* Submit Button */}
            <Button
              className="h-12 w-full disabled:bg-zinc-300"
              disabled={loading}
              type="submit"
            >
              {loading ? <Loading /> : 'Login'}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};
export default SignIn;
