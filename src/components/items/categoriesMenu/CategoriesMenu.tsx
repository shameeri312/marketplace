'use client';

import * as React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/categories';
import { Title } from '@/components/ui/title';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { menuLinks } from '@/lib/links';

export function CategoriesMenu() {
  const [search, setSearch] = React.useState<string>('');

  // Handle click on any menu item to close the menu
  const handleLinkClick = () => {
    // Trigger the click on the NavigationMenuTrigger to close the menu
    const trigger = document.querySelector('.navigation-menu-trigger');
    if (trigger) {
      (trigger as HTMLElement).click();
    }
  };

  return (
    <>
      <NavigationMenu className="flex-1 md:w-max">
        <NavigationMenuList className="flex w-full overflow-x-auto">
          <NavigationMenuItem className="flex-shrink-0">
            <NavigationMenuTrigger className="navigation-menu-trigger border border-input bg-background hover:bg-accent hover:text-accent-foreground">
              All Categories
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="max-h-[calc(90vh_-_150px)] min-h-[600px] overflow-y-auto p-4 xl:w-[1280px]">
                <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                  <Title size="sm" as="h6">
                    All Categories
                  </Title>

                  <div>
                    <Input
                      placeholder="Search category..."
                      onChange={(e) => setSearch(e.target.value)}
                      value={search}
                    />
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                  {Object.entries(categories)
                    .filter(([key, values]) => {
                      const searchTerm = search.toLowerCase();
                      return (
                        key.toLowerCase().includes(searchTerm) ||
                        values.some((value) =>
                          value.toLowerCase().includes(searchTerm)
                        )
                      );
                    })
                    .map(([key, values]) => (
                      <div
                        key={key}
                        className="mb-4 w-[300px] break-inside-avoid space-y-2 xl:w-auto"
                      >
                        <Title size="sm" as="h3">
                          <Link
                            href={`/category/${key}`}
                            onClick={handleLinkClick}
                          >
                            {key}
                          </Link>
                        </Title>
                        <ul className="space-y-2">
                          {values.map((value) => (
                            <li key={value} className="text">
                              <Link
                                href={`/items?query=${value}`}
                                onClick={handleLinkClick}
                              >
                                <Text as="span">{value}</Text>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                </div>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem className="px-2">
            <div className="h-[30px] border-l border-muted-foreground" />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* separator */}

      <div className="hidden w-full items-center justify-start overflow-x-auto md:flex">
        <Link href={'/explore'}>
          <Button className="font-normal" variant={'outline'}>
            Explore
          </Button>
        </Link>
        {menuLinks.map((link, index) => (
          <Link href={'/category/' + link.path} key={index}>
            <Button className="font-normal" variant={'ghost'}>
              {link.name}
            </Button>
          </Link>
        ))}
      </div>
    </>
  );
}
