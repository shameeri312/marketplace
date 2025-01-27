/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronDown, LogIn, LogOut, Pencil, Plus } from 'lucide-react';
import { FiUserPlus } from 'react-icons/fi';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import MenuLinks from '@/components/home/navbar/MenuLinks';
import { CiMenuBurger } from 'react-icons/ci';
import { Dialog } from '@/components/ui/dialog';
import AuthDialog from '@/components/home/auth/AuthDialog';
import Form from 'next/form';
import { useRouter, useSearchParams } from 'next/navigation';
import { Title } from '@/components/ui/title';
import { signOut, useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { CategoriesMenu } from '../../items/categoriesMenu/CategoriesMenu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import SearchForm from '../searchForm/SearchForm';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';

const Navbar = () => {
  const [isOpen, toggleDialog] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const { data: session }: any = useSession(); // get session

  const params = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>(
    params.get('query') || ''
  );

  const openDialog = () => toggleDialog(true);
  // const closeDialog = () => toggleDialog(false);

  useEffect(() => {
    if (params) {
      const query = params.get('query');
      setSearchQuery(query || '');
    }
  }, [params]);

  useEffect(() => {
    if (!isOpen) router.push('/');
    console.log(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (session?.user) {
      setIsAuth(true);
    }
  }, [session]);

  console.log(session);

  // logout from the session
  const logOut = async () => {
    try {
      router.push('/');

      await signOut({ redirect: false });
      setIsAuth(false);

      toast.info('Logged out successfully');
    } catch (error) {
      console.log(error);
      toast.error('Error logging out, please try again.');
    }
  };

  return (
    <header>
      <div className={'h-auto space-y-2 p-2 md:h-[80px] md:space-y-0'}>
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
                  'hidden h-10 w-10 place-content-center rounded-md bg-white text-secondary-foreground md:hidden'
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
            {isAuth ? (
              <div className="flex items-center space-x-2">
                <Button
                  variant={'outline'}
                  size={'sm'}
                  className="rounded-full border-2 border-primary font-semibold text-primary hover:text-primary"
                  onClick={() => router.push('/post')}
                >
                  <Plus />
                  Post an ad
                </Button>
                <Popover>
                  <PopoverTrigger className="flex items-center">
                    <Avatar>
                      <AvatarImage
                        src={process.env.API_URL_PREFIX + session?.user?.image}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {session?.user?.firstName[0] +
                          session?.user?.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown />
                  </PopoverTrigger>

                  <PopoverContent className="mr-4 w-[200px] pb-2 lg:w-[250px] xl:mr-8 2xl:mr-28">
                    <div className="flex flex-col items-center gap-2">
                      <Avatar className="size-20">
                        <AvatarImage
                          src={
                            process.env.API_URL_PREFIX + session?.user?.image
                          }
                          className="object-cover"
                        />
                        <AvatarFallback>
                          {session?.user?.firstName[0] +
                            session?.user?.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Title size="sm" className="text-center">
                        {session?.user?.firstName} {session?.user?.lastName}
                      </Title>
                      <Button
                        variant={'outline'}
                        className="border-neutral-400 font-light"
                        size={'sm'}
                      >
                        Edit profile <Pencil className="text-neutral-600" />
                      </Button>
                    </div>

                    <Separator className="mt-2" />

                    <ul className="flex flex-col gap-2">
                      <li>
                        <Button
                          variant={'link'}
                          className="p-0"
                          type="button"
                          onClick={logOut}
                        >
                          <LogOut />
                          Logout
                        </Button>
                      </li>
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <Dialog open={isOpen} onOpenChange={toggleDialog}>
                <>
                  <div className={'flex gap-2'}>
                    <Form
                      className="hidden sm:block"
                      action={''}
                      scroll={false}
                    >
                      <input name={'auth'} defaultValue={'sign-in'} hidden />

                      <Button
                        type="submit"
                        variant={'outline'}
                        onClick={openDialog}
                        className={'border-white hover:bg-white/80'}
                      >
                        <LogIn />
                        Sign in
                      </Button>
                    </Form>

                    <Form action={''} scroll={false}>
                      <input name={'auth'} defaultValue={'sign-up'} hidden />

                      <Button onClick={openDialog} type="submit">
                        <FiUserPlus /> Sign up
                      </Button>
                    </Form>
                  </div>
                </>
                <AuthDialog />
              </Dialog>
            )}
          </div>
        </div>
      </div>

      <div className="shadow-m border-b border-t border-muted-foreground/20 bg-muted/30">
        <div className="container mx-auto flex h-[60px] items-center justify-between">
          <CategoriesMenu />

          <div className={'max-w-[300px] md:w-1/3'}>
            <SearchForm query={searchQuery} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
