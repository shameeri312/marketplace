import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Title } from '@/components/ui/title';
import { menuLinks } from '@/lib/links';
import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <>
      <footer className="padding bg-muted/40">
        <div className="container mx-auto flex flex-col flex-wrap items-start gap-6 md:flex-row md:flex-nowrap md:gap-0">
          <div className="mx-auto w-64 flex-shrink-0 text-center md:mx-0 md:text-left">
            <Link href={'/'} className={'w-max'}>
              <Title size="lg" className="uppercase">
                <span className={'text-primary'}>E</span>
                Mart
              </Title>
            </Link>
            <p className="mt-2 text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur.
            </p>
          </div>

          <div className="flex flex-grow flex-wrap gap-6 text-center md:gap-0 md:text-left">
            <div className="w-full px-4 sm:mt-0 md:w-1/2 lg:w-1/3">
              <h2 className="mb-3 text-sm font-medium tracking-widest text-gray-900">
                CATEGORIES
              </h2>

              <div className="flex flex-col">
                {menuLinks.map((link, index) => (
                  <Link href={link.path} key={index}>
                    <Button
                      className="!h-4 font-normal text-muted-foreground"
                      variant={'link'}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="w-full px-4 sm:mt-0 md:w-1/2 lg:w-1/3">
              <h2 className="mb-3 text-sm font-medium tracking-widest text-gray-900">
                CATEGORIES
              </h2>

              <div className="flex flex-col">
                {menuLinks.map((link, index) => (
                  <Link href={link.path} key={index}>
                    <Button
                      className="!h-4 font-normal text-muted-foreground"
                      variant={'link'}
                    >
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-4 px-4 sm:w-[400px] md:w-1/2 lg:mt-0 lg:w-1/3">
              <h2 className="mb-3 text-sm font-medium tracking-widest text-gray-900">
                Subscribe us
              </h2>

              <div className="flex flex-col">
                <form className="flex">
                  <Input placeholder="Email" className="rounded-r-none" />
                  <Button className="rounded-l-none">Subscribe</Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="border-t-2 bg-muted/70 py-4 text-center">
        <Title size="sm" className="text-xs md:text-sm">
          ©COPRYRIGHT 2025 | EMART
        </Title>
      </div>
    </>
  );
};

export default Footer;
