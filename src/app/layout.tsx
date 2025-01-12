import Footer from '@/components/home/footer/Footer';
import './globals.css';
import localFont from 'next/font/local';
import { Toaster } from 'sonner';

const poppins = localFont({
  src: [
    {
      path: '/fonts/Poppins/Poppins-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '/fonts/Poppins/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '/fonts/Poppins/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '/fonts/Poppins/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '/fonts/Poppins/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '/fonts/Poppins/Poppins-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-poppins', // Define CSS variable for Poppins
});

const openSans = localFont({
  src: [
    {
      path: '/fonts/Open_Sans/OpenSans-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '/fonts/Open_Sans/OpenSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '/fonts/Open_Sans/OpenSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '/fonts/Open_Sans/OpenSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '/fonts/Open_Sans/OpenSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '/fonts/Open_Sans/OpenSans-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-open-sans',
});

export const metadata = {
  title: 'Your Marketplace App',
  description: 'A modern marketplace built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${openSans.variable}`}
      suppressHydrationWarning
    >
      <body className="font-poppins">
        <Toaster />
        {children}
        <Footer />
      </body>
    </html>
  );
}
