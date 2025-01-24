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
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loading from '@/components/loading/Loading';
import { toast } from 'sonner';

// Validation schema
const signUpSchema = z.object({
  firstname: z.string().nonempty('First name is required'),
  lastname: z.string().nonempty('Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const SignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);

  // Initialize form with validation schema
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    setLoading(true);

    const credentials = {
      firstname: values.firstname,
      lastname: values.lastname,
      email: values.email,
      password: values.password,
    };
    toast(
      <div className="w-full rounded-[4px] border-2 bg-secondary p-2">
        <pre>
          Submitted:
          {JSON.stringify(credentials, null, 2)}
        </pre>
      </div>
    );
    console.log(credentials);
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
