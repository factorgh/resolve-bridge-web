'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

const STANDALONE_ROUTES = ['/portal', '/login'];

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStandalone = STANDALONE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));

  if (isStandalone) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="grid-bg" />
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
