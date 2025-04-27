/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import clsx from 'clsx';
import { usePathname, usepathname, useSearchParams } from 'next/navigation';
import Header from './header';
import { useSession } from 'next-auth/react';
import Sidebar from './newChatSidebar';
import { useOpen } from '@/context/openContext';

const Chats = () => {
  const { isOpen, setIsOpen } = useOpen();
  const { data: session }: any = useSession();
  const searchParams = useSearchParams();
  const userid = searchParams.get('userid');
  const [check, setCheck] = useState(false);
  const pathname = usePathname();

  if (!session) return;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ stiffness: 100, duration: 0.7, ease: 'easeInOut' }}
      className="shadow-n flex h-screen flex-col justify-start gap-3 rounded-3xl bg-blue-400 p-0 sm:flex-row md:h-[97vh] md:p-2"
    >
      <Header
        fullname={session?.firstName + '' + session?.lastName}
        img={session?.image}
      />

      <Sidebar
        setOpen={setIsOpen}
        setCheck={setCheck}
        fullname={session?.firstName + '' + session?.lastName}
        img={session?.image}
      />

      <AnimatePresence>
        {check && pathname !== '/profileview/' && (
          <motion.div
            key={isOpen}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ stiffness: 100, duration: 0.3, ease: 'easeInOut' }}
            className={clsx(
              'absolute right-0 top-0 h-full w-full overflow-hidden rounded-3xl border-[1px] border-blue-300 bg-white sm:w-[89%] md:static md:flex md:w-[60%] lg:w-[70%]'
            )}
          >
            {pathname == '/chat/' && <Chat key={userid} setIsOpen={setCheck} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* mobile nav */}
      {!check && <MobileNav setCheck={setCheck} />}
    </motion.div>
  );
};

export default Chats;
