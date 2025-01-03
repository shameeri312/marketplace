import React, { Suspense } from 'react';
import Link from 'next/link';
import SearchForm from '@/components/root/searchForm/SearchForm';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { FiUserPlus } from 'react-icons/fi';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import MenuLinks from '@/components/root/navbar/MenuLinks';
import { CiMenuBurger } from 'react-icons/ci';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import SignInDialog from '@/components/root/auth/SignInDialog';

const Navbar = () => {
  return (
    <header className={'h-[72px] bg-muted p-2 md:h-[80px]'}>
      <div
        className={
          'container flex h-full w-full items-center justify-between gap-2'
        }
      >
        <div
          className={
            'flex h-full w-1/3 items-center justify-start gap-2 rounded-lg md:w-1/5 lg:w-2/5'
          }
        >
          <Sheet>
            {/*menu links*/}
            <MenuLinks />
            <SheetTrigger
              className={
                'grid h-10 w-10 place-content-center rounded-md bg-white text-secondary-foreground'
              }
            >
              <CiMenuBurger size={24} />
            </SheetTrigger>
          </Sheet>
          {/*site title*/}
          <Link href={'/'}>
            <h1 className={'site-title'}>
              <span className={'text-primary'}>E</span>
              Mart
            </h1>
          </Link>
        </div>

        <div
          className={
            'hidden h-full w-full items-center justify-evenly rounded-lg md:flex md:w-4/5 lg:w-3/5'
          }
        >
          <Suspense fallback={<div>Loading...</div>}>
            <SearchForm />
          </Suspense>
        </div>

        <div
          className={
            'flex h-full w-2/3 items-center justify-end md:w-1/5 lg:w-2/5'
          }
        >
          <Dialog>
            <DialogTrigger asChild>
              <div className={'flex gap-2'}>
                <Button
                  variant={'outline'}
                  className={'border-white hover:bg-white/80'}
                >
                  <LogIn /> Login
                </Button>

                <Button variant={'default'}>
                  <FiUserPlus /> Sign up
                </Button>
              </div>
            </DialogTrigger>
            <SignInDialog />
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
