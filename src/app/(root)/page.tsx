import { CategoriesMenu } from '@/components/home/categoriesMenu/CategoriesMenu';
import FeaturedSlider from '@/components/home/featured/FeaturedSlider';
import Cars from '@/components/home/products/cars/Cars';
import MobilePhones from '@/components/home/products/mobilePhones/MobilePhones';
import SearchForm from '@/components/home/searchForm/SearchForm';
import { Separator } from '@/components/ui/separator';
import { Title } from '@/components/ui/title';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default async function Home({
  params,
}: {
  params: Promise<{ query?: string }>;
}) {
  const { query } = await params;

  return (
    <main className="space-y-2 md:space-y-4 lg:space-y-6">
      {query ? `Search results for "${query}"` : ''}

      {!query && (
        <>
          <section className="shadow-m border-b border-t border-muted-foreground/20 bg-muted">
            <div className="container mx-auto flex h-[60px] items-center justify-between">
              <CategoriesMenu />
              <div className={'max-w-[300px] md:w-1/3'}>
                <SearchForm query={query} />
              </div>
            </div>
          </section>

          <section className="container">
            <FeaturedSlider />
          </section>

          <section className="padding bg-[#f6f6f6]">
            <div className="container space-y-5">
              <div className="flex items-center justify-between px-2">
                <Title className="w-max" size="md" as="h2">
                  Mobile Phones
                </Title>
                <div>
                  <Link
                    href="/category/mobiles"
                    className="flex text-xs text-primary sm:text-sm"
                  >
                    View More <ChevronRight className="size-4 sm:size-5" />
                  </Link>
                </div>
              </div>

              <MobilePhones />

              <div className="flex items-center justify-between px-2">
                <Title className="w-max" size="md" as="h2">
                  Cars
                </Title>
                <div>
                  <Link
                    href="/category/cars"
                    className="flex text-xs text-primary sm:text-sm"
                  >
                    View More <ChevronRight className="size-4 sm:size-5" />
                  </Link>
                </div>
              </div>

              <Cars />
            </div>
          </section>
        </>
      )}
    </main>
  );
}
