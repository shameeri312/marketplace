import Navbar from '@/components/home/navbar/Navbar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <Navbar />
      {children}
      
    </main>
  );
}
