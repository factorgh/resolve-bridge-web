import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Portal | ResolveBridge',
  description: 'Manage your financial portfolio, loans, and insurance on ResolveBridge.',
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  // This layout intentionally omits Navbar/Footer — the portal is a standalone app shell
  return <>{children}</>;
}
