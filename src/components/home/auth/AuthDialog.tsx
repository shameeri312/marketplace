'use client';
import React, { useCallback } from 'react';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import SignIn from './forms/SignIn';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import SignUp from './forms/SignUp';
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import { DialogDescription } from '@radix-ui/react-dialog';
import { GoogleAuthButton } from './GoogleAuthButton';

const AuthDialog = () => {
  const params = useSearchParams();
  const form = params.get('auth');
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

  if (!form) return null;

  return (
    <DialogContent className="h-auto max-h-[90vh] w-[95%] max-w-[500px] overflow-y-auto rounded-3xl p-4 sm:py-10 lg:pr-4">
      <div
        className={
          'mx-auto flex w-[95%] flex-col items-center gap-2 py-5 sm:py-0 md:gap-3'
        }
      >
        <DialogTitle className="text-3xl lg:text-4xl">
          {form === 'sign-in' ? 'Sign In' : 'Sign Up'}
        </DialogTitle>
        <DialogDescription className="text font-light text-muted-foreground">
          {form === 'sign-in'
            ? 'Enter credentials to sign in'
            : 'Fill the form to sign up'}
        </DialogDescription>

        {form === 'sign-in' ? <SignIn /> : <SignUp />}

        {form === 'sign-in' ? (
          <Text as="p" className="py-2 text-center">
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
        ) : (
          <Text as="p" className="py-2 text-center">
            Already have an account?{' '}
            <span
              onClick={() => {
                router.push(
                  pathname + '?' + createQueryString('auth', 'sign-in')
                );
              }}
              className="cursor-pointer text-blue-500"
            >
              Sign in here
            </span>
          </Text>
        )}

        {form === 'sign-in' && (
          <>
            <div className={'flex w-full items-center gap-5 px-2'}>
              <Separator className={'flex-1'} />
              <span className={'text-secondary-foreground/50'}>OR</span>
              <Separator className={'flex-1'} />
            </div>
            {/* <Button variant={'outline'} className="text-muted-foreground">
              <Google /> Continue with Google
            </Button> */}
            <GoogleAuthButton text="Sign In with Google" />
          </>
        )}
      </div>
    </DialogContent>
  );
};

export default AuthDialog;
