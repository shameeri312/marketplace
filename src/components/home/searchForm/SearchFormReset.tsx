'use client';
import React from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const SearchFormReset = () => {
  const reset = () => {
    const form = document.querySelector('.search-form') as HTMLFormElement;
    if (form) form.reset();
  };

  return (
    <Button type={'reset'} variant={'ghost'} size={'icon'} onClick={reset}>
      <Link href={'/items'} className={'search-btn'}>
        <X className={'size-5'} />
      </Link>
    </Button>
  );
};
export default SearchFormReset;
