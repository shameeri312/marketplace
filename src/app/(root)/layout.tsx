import Navbar from '@/components/root/navbar/Navbar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={'font-open-sans'}>
      <Navbar />
      {children}
    </main>
  );
}
