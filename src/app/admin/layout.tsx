import AdminClientLayout from './client-layout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | SantriPlacement',
  description: 'Admin dashboard for SantriPlacement system.',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
