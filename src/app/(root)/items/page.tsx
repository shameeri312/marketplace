import { CategoriesMenu } from '@/components/home/categoriesMenu/CategoriesMenu';
import SearchForm from '@/components/home/searchForm/SearchForm';
import Items from '@/components/items/All';
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
      <section className="shadow-m border-b border-t border-muted-foreground/20 bg-muted">
        <div className="container mx-auto flex h-[60px] items-center justify-between">
          <CategoriesMenu />
          <div className={'max-w-[300px] md:w-1/3'}>
            <SearchForm query={query} />
          </div>
        </div>
      </section>

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
