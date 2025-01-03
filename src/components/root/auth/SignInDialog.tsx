import React from 'react';
import { DialogContent } from '@/components/ui/dialog';

const SignInDialog = () => {
  return (
    <DialogContent className="h-[750px] max-h-[90vh] w-[95%] overflow-y-auto rounded-3xl p-0 pr-4 md:max-w-[600px] lg:max-w-[1280px]">
      <div className={'flex items-center justify-between'}>
        <div
          className={
            'hidden h-full w-full rounded-l-2xl bg-red-300 lg:flex lg:w-1/2'
          }
        ></div>
        <div className={'b-b h-[600px] w-full lg:w-1/2'}></div>
      </div>
    </DialogContent>
  );
};
export default SignInDialog;
