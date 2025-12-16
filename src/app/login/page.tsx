'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/admin');
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2 xl:min-h-screen">
      <div className="relative hidden bg-gray-100 lg:block">
         <Image
            src="https://images.unsplash.com/photo-1562774053-62575634381b?q=80&w=2070&auto=format&fit=crop"
            alt="Gontor building"
            layout="fill"
            objectFit="cover"
            className="opacity-20"
            data-ai-hint="university building"
        />
        <div className="relative z-10 flex h-full flex-col justify-between bg-primary/90 p-12 text-primary-foreground">
          <div className="flex items-center gap-3">
             <div className="bg-primary-foreground/20 p-3 rounded-lg">
                <GraduationCap className="h-8 w-8" />
             </div>
          </div>
          <div className='max-w-md'>
            <h1 className="text-4xl font-bold tracking-tight">
              Pondok Modern Darussalam Gontor
            </h1>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Welcome to the Panitia Access Portal. Securely manage student placements and administrative tasks efficiently.
            </p>
          </div>
          <footer className="text-sm text-primary-foreground/60">
             &copy; {new Date().getFullYear()} Pondok Modern Darussalam Gontor. All rights reserved.
          </footer>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Admin Login</h1>
            <p className="text-balance text-muted-foreground">
              Student Placement System - Panitia Access
            </p>
          </div>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username or Email</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username or email"
                required
                defaultValue="superadmin"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="Enter your password"
                  required
                  defaultValue="password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-1 right-1 h-7 w-7"
                  onClick={togglePasswordVisibility}
                >
                  {passwordVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {passwordVisible ? 'Hide password' : 'Show password'}
                  </span>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
                <div className='flex items-center space-x-2'>
                    <Checkbox id="remember-me" />
                    <Label htmlFor="remember-me" className='text-sm font-normal'>Remember me</Label>
                </div>
                <Link
                    href="#"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                    Forgot Password?
                </Link>
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
           <p className="mt-4 text-center text-sm text-muted-foreground lg:hidden">
             &copy; {new Date().getFullYear()} Pondok Modern Darussalam Gontor. All rights reserved.
           </p>
        </div>
      </div>
    </div>
  );
}
