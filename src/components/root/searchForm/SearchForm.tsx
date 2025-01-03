'use client';
import React from 'react';
import Form from 'next/form';
import SearchFormReset from '@/components/root/searchForm/SearchFormReset';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';

const SearchForm = () => {
  const searchParams = useSearchParams();

  const query = searchParams.get('query') || undefined;

  return (
    <Form action={'/'} scroll={false} className={'search-form'}>
      <input
        name={'query'}
        defaultValue={query}
        className={
          'w-full flex-1 border-none bg-transparent px-3 outline-none placeholder:text-muted-foreground'
        }
        placeholder={'Search...'}
      />

      {query && <SearchFormReset />}

      <Button type={'submit'} variant={'outline'} className={''} size={'icon'}>
        <Search />
      </Button>
    </Form>
  );
};

export default SearchForm;
