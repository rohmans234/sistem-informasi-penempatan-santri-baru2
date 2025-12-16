import { PlacementCheckForm } from '@/components/placement-check-form';
import { Button } from '@/components/ui/button';
import { GanttChartSquare } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="px-4 lg:px-6 h-16 flex items-center shadow-sm bg-card">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center justify-center gap-2">
            <GanttChartSquare className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">SantriPlacement</span>
          </Link>
          <nav className="flex gap-4 sm:gap-6">
            <Button asChild variant="default">
              <Link href="/admin">Admin Login</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl font-headline">
              Sistem Informasi Penempatan Santri Baru
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Pondok Modern Darussalam Gontor
            </p>
          </div>
          <PlacementCheckForm />
        </div>
      </main>
      <footer className="py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-card">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Pondok Modern Darussalam Gontor. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
