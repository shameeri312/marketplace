import { CategoriesMenu } from '@/components/home/categoriesMenu/CategoriesMenu';
import FeaturedSlider from '@/components/home/featured/FeaturedSlider';
import Bikes from '@/components/home/items/bikes/Bikes';
import Cars from '@/components/home/items/cars/Cars';
import Jobs from '@/components/home/items/jobs/Jobs';
import MobilePhones from '@/components/home/items/mobilePhones/MobilePhones';
import Property from '@/components/home/items/property/Property';
import SearchForm from '@/components/home/searchForm/SearchForm';

export default async function Home() {
  return (
    <main className="space-y-2 md:space-y-4 lg:space-y-6">
      <>
        <section className="shadow-m border-b border-t border-muted-foreground/20 bg-muted">
          <div className="container mx-auto flex h-[60px] items-center justify-between">
            <CategoriesMenu />
            <div className={'max-w-[300px] md:w-1/3'}>
              <SearchForm />
            </div>
          </div>
        </section>

        <>
          <section className="container">
            <FeaturedSlider />
          </section>

          <section className="padding bg-[#f6f6f6]">
            <div className="container space-y-5">
              <MobilePhones />

              <Cars />

              <Property />

              <Jobs />

              <Bikes />
            </div>
          </section>
        </>
      </>
    </main>
  );
}
