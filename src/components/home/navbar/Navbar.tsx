'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { FiUserPlus } from 'react-icons/fi';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import MenuLinks from '@/components/home/navbar/MenuLinks';
import { CiMenuBurger } from 'react-icons/ci';
import { Dialog } from '@/components/ui/dialog';
import AuthDialog from '@/components/home/auth/AuthDialog';
import Form from 'next/form';
import { useRouter } from 'next/navigation';
import { Title } from '@/components/ui/title';

const Navbar = () => {
  const [isOpen, toggleDialog] = useState<boolean>(false);
  const router = useRouter();

  const openDialog = () => toggleDialog(true);
  // const closeDialog = () => toggleDialog(false);

  useEffect(() => {
    if (!isOpen) router.push('/');
    console.log(isOpen);
  }, [isOpen]);

  return (
    <header
      className={'h-auto space-y-2 bg-muted p-2 md:h-[80px] md:space-y-0'}
    >
      <div
        className={
          'flex h-full w-full items-center justify-between gap-2 md:container'
        }
      >
        <div
          className={
            'flex h-full w-1/2 items-center justify-start gap-2 rounded-lg md:w-1/3 lg:w-2/5'
          }
        >
          <Sheet>
            {/*menu links*/}
            <MenuLinks />
            <SheetTrigger
              className={
                'grid h-10 w-10 place-content-center rounded-md bg-white text-secondary-foreground md:hidden'
              }
            >
              <CiMenuBurger size={24} />
            </SheetTrigger>
          </Sheet>

          {/*site title*/}
          <Link href={'/'} className={'w-max'}>
            <Title size="lg" className="uppercase">
              <span className={'text-primary'}>E</span>
              Mart
            </Title>
          </Link>
        </div>

        <div
          className={
            'hidden h-full w-full items-center justify-evenly rounded-lg md:flex md:w-1/3 lg:w-3/5'
          }
        ></div>

        <div
          className={
            'flex h-full w-1/2 items-center justify-end md:w-1/3 lg:w-2/5'
          }
        >
          <Dialog open={isOpen} onOpenChange={toggleDialog}>
            <>
              <div className={'flex gap-2'}>
                <Form className="hidden sm:block" action={'/'} scroll={false}>
                  <input name={'auth'} defaultValue={'sign-in'} hidden />

                  <Button
                    type="submit"
                    variant={'outline'}
                    onClick={openDialog}
                    className={'border-white hover:bg-white/80'}
                  >
                    <LogIn />
                    Login
                  </Button>
                </Form>

                <Form action={'/'} scroll={false}>
                  <input name={'auth'} defaultValue={'sign-up'} hidden />

                  <Button onClick={openDialog} type="submit">
                    <FiUserPlus /> Sign up
                  </Button>
                </Form>
              </div>
            </>
            <AuthDialog />
          </Dialog>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
