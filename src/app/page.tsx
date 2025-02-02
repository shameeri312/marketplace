import FeaturedSlider from '@/components/home/featured/FeaturedSlider';
import Bikes from '@/components/home/items/bikes/Bikes';
import Cars from '@/components/home/items/cars/Cars';
import Jobs from '@/components/home/items/jobs/Jobs';
import MobilePhones from '@/components/home/items/mobilePhones/MobilePhones';
import Property from '@/components/home/items/property/Property';
import TopSellers from '@/components/home/topSellers/TopSellers';

export default async function Home() {
  return (
    <main className="space-y-2 md:space-y-4 lg:space-y-6">
      <>
        <>
          <section className="container">
            <FeaturedSlider />
          </section>

          <section className="padding">
            <div className="container space-y-5">
              <TopSellers />

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
