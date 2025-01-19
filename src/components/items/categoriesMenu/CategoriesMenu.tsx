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
import { usePathname } from 'next/navigation';

export function CategoriesMenu() {
  const [search, setSearch] = React.useState<string>('');
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [blink, blinkMenu] = React.useState<boolean>(true);
  const pathname = usePathname();

  const filteredCategories = Object.entries(categories).filter(
    ([key, values]) => {
      const searchTerm = search.toLowerCase();
      return (
        key.toLowerCase().includes(searchTerm) ||
        values.some((value) => value.toLowerCase().includes(searchTerm))
      );
    }
  );

  const handleLinkClick = () => {
    setIsOpen(false); // Close the menu on link click
  };

  React.useEffect(() => {
    console.log('Route changed!');

    // Set blinkMenu to false
    blinkMenu(false);

    // Set blinkMenu back to true after 100ms
    const timer = setTimeout(() => {
      blinkMenu(true);
    }, 10);

    // Cleanup the timer when the component unmounts or `pathname` changes
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    blink && (
      <>
        <NavigationMenu className="flex-1 md:w-max">
          <NavigationMenuList className="flex w-full overflow-x-auto">
            <NavigationMenuItem className="flex-shrink-0">
              <NavigationMenuTrigger
                onClick={() => setIsOpen(!isOpen)}
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground"
              >
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
                      />
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="columns-1 gap-6 sm:columns-2 lg:columns-3 xl:columns-4">
                    {filteredCategories.map(([key, values]) => (
                      <div
                        key={key}
                        className="mb-4 w-[300px] break-inside-avoid space-y-2 xl:w-auto"
                      >
                        <Title size="sm" as="h3" onClick={handleLinkClick}>
                          <Link href={`/category/${key}`}>{key}</Link>
                        </Title>
                        <ul className="space-y-2">
                          {values.map((value) => (
                            <li
                              key={value}
                              className="text"
                              onClick={handleLinkClick}
                            >
                              <Link href={`/category/${key}/${value}`}>
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
          {menuLinks.map((link, index) => (
            <Link href={'/category/' + link.path} key={index}>
              <Button className="font-normal" variant={'ghost'}>
                {link.name}
              </Button>
            </Link>
          ))}
        </div>
      </>
    )
  );
}
