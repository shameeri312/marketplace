/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Title } from '@/components/ui/title';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import CardsWrapper from '../../../items/cardsWrapper/CardsWrapper';
import axios from 'axios';

const Jobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('/api/category/Jobs');
        setJobs(res.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <>
      <div className="flex items-center justify-between px-2">
        <Title className="w-max" size="md" as="h2">
          Jobs
        </Title>
        <div>
          <Link
            href="/category/jobs"
            className="flex text-xs text-primary sm:text-sm"
          >
            View More <ChevronRight className="size-4 sm:size-5" />
          </Link>
        </div>
      </div>
      <CardsWrapper data={jobs} />
    </>
  );
};

export default Jobs;
