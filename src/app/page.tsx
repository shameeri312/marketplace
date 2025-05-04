import FeaturedSlider from '@/components/home/featured/FeaturedSlider';
import Home from '@/components/home/Home';
import TopSellers from '@/components/home/topSellers/TopSellers';

export default async function HomePage() {
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
              <Home />
            </div>
          </section>
        </>
      </>
    </main>
  );
}
