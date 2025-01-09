'use client';
import React from 'react';
import { DialogContent } from '@/components/ui/dialog';
import SignIn from './forms/SignIn';
import { useSearchParams } from 'next/navigation';
import SignUp from './forms/SignUp';

const AuthDialog = () => {
  const params = useSearchParams();
  const form = params.get('auth');

  if (!form) return null;

  return (
    <DialogContent className="h-auto max-h-[90vh] w-[95%] overflow-y-auto rounded-3xl sm:py-10 lg:h-[700px] lg:max-w-[1140px] lg:p-0 lg:py-0 lg:pr-4">
      <div className={'flex items-center justify-between'}>
        <div
          className={
            'hidden h-full w-full rounded-l-2xl bg-red-300 lg:flex lg:w-1/2'
          }
        ></div>
        <div
          className={
            'flex h-full w-full flex-col justify-center lg:w-1/2 lg:pl-4'
          }
        >
          {form === 'sign-in' ? <SignIn /> : <SignUp />}
        </div>
      </div>
    </DialogContent>
  );
};
export default AuthDialog;
