import { PlacementCheckForm } from '@/components/placement-check-form';
import { Button } from '@/components/ui/button';
import { GraduationCap, LogIn } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <header className="px-4 lg:px-10 h-20 flex items-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-20 border-b dark:border-gray-800">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-3">
            <div className="bg-primary p-2 rounded-md">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100 block leading-tight">
                Pondok Modern Darussalam Gontor
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400 leading-tight">
                Sistem Penempatan Santri Baru
              </span>
            </div>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Button asChild variant="outline">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login Staff
              </Link>
            </Button>
             <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
          <PlacementCheckForm />
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white dark:bg-gray-950 dark:border-gray-800">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400 gap-4">
          <p>&copy; {new Date().getFullYear()} Pondok Modern Darussalam Gontor. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Official Website</Link>
            <Link href="#" className="hover:text-primary transition-colors">Bantuan</Link>
            <Link href="#" className="hover:text-primary transition-colors">Kontak Kami</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
