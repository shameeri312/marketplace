'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Title } from '../ui/title';
import CardsWrapper from '../items/cardsWrapper/CardsWrapper';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Loading from '../loading/Loading';

const Home = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [mobilePhones, setMobilePhones] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [bikes, setBikes] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all([
          axios.get('/api/category/Mobile Phones'),
          axios.get('/api/category/Vehicles'), // Assuming 'Vehicles' is the endpoint for cars
          axios.get('/api/category/Property for Rent'),
          axios.get('/api/category/Bikes'),
          axios.get('/api/category/Jobs'),
        ]);

        // Set state for each category, limiting to 4 items
        setMobilePhones(responses[0].data.slice(0, 4) || []);
        setCars(responses[1].data.slice(0, 4) || []);
        setProperties(responses[2].data.slice(0, 4) || []);
        setBikes(responses[3].data.slice(0, 4) || []);
        setJobs(responses[4].data.slice(0, 4) || []);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  return isLoading ? (
    <Loading />
  ) : (
    <>
      {/* Mobile Phon es Section */}
      {mobilePhones.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between px-2">
            <Title className="w-max" size="md" as="h2">
              Mobile Phones
            </Title>
            <div>
              <Link
                href="/category/Mobile Phones"
                className="flex text-xs text-primary sm:text-sm"
              >
                View More <ChevronRight className="size-4 sm:size-5" />
              </Link>
            </div>
          </div>
          <CardsWrapper data={mobilePhones} />
        </>
      )}

      {/* Cars Section */}
      {cars.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between px-2">
            <Title className="w-max" size="md" as="h2">
              Cars
            </Title>
            <div>
              <Link
                href="/items"
                className="flex text-xs text-primary sm:text-sm"
              >
                View More <ChevronRight className="size-4 sm:size-5" />
              </Link>
            </div>
          </div>
          <CardsWrapper data={cars} />
        </>
      )}

      {/* Property Section */}
      {properties.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between px-2">
            <Title className="w-max" size="md" as="h2">
              Property
            </Title>
            <div>
              <Link
                href="/category/property"
                className="flex text-xs text-primary sm:text-sm"
              >
                View More <ChevronRight className="size-4 sm:size-5" />
              </Link>
            </div>
          </div>
          <CardsWrapper data={properties} />
        </>
      )}

      {/* Bikes Section */}
      {bikes.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between px-2">
            <Title className="w-max" size="md" as="h2">
              Bikes
            </Title>
            <div>
              <Link
                href="/category/bikes"
                className="flex text-xs text-primary sm:text-sm"
              >
                View More <ChevronRight className="size-4 sm:size-5" />
              </Link>
            </div>
          </div>
          <CardsWrapper data={bikes} />
        </>
      )}

      {/* Jobs Section */}
      {jobs.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between px-2">
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
      )}
    </>
  );
};

export default Home;
