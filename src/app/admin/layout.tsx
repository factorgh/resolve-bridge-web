import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Console | ResolveBridge',
  description: 'ResolveBridge Central Administration and Multi-Tenant Partner Console.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Standalone shell page layout for partners and platform admins
  return <>{children}</>;
}
