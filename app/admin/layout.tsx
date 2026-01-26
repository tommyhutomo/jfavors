import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Panel - JFavour',
  description: 'Admin panel for JFavour events management',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}

