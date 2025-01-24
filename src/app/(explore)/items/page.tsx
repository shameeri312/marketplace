import Items from '@/components/items/all';
import Sidebar from '@/components/items/sidebar/Sidebar';

export default async function ItemsPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; category: string[] }>;
}) {
  const query = (await searchParams)?.query || '';
  const category = (await searchParams)?.category || '';

  return (
    <>
      <main className="padding">
        <section className="container flex flex-col gap-4 md:flex-row md:gap-2">
          <div className="md:1/3 lg:w-1/4">
            <Sidebar query={query} category={category || []} />
          </div>
          <div className="md:2/3 lg:w-3/4">
            <Items />
          </div>
        </section>
      </main>
    </>
  );
}
