'use client';
import React from 'react';
import { X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SearchFormReset = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reset = () => {
    // Reset the form
    const form = document.querySelector('.search-form') as HTMLFormElement;
    if (form) form.reset();

    // Create a new search params object excluding query parameters
    const params = new URLSearchParams(searchParams);
    params.delete('query'); // Replace 'query' with the specific query param you want to remove

    // Update the URL without redirecting
    router.replace(`/items?${params.toString()}`);
  };

  return (
    <Button
      type="reset"
      variant="ghost"
      className="size-8"
      size="icon"
      onClick={reset}
    >
      <X className="size-5" />
    </Button>
  );
};

export default SearchFormReset;
