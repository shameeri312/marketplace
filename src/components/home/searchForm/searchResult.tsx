'use client';
import { useSearchParams } from 'next/navigation';

export const SearchResult = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query');

  return query;
};
