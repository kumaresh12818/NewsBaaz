
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Newspaper, Home, Bookmark, Settings, LogIn, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const navItems = [
  { href: '/', label: 'News', icon: Home },
  { href: '/photography', label: 'Photography', icon: Camera },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ isMobile = false }: { isMobile?: boolean }) {
  const pathname = usePathname();

  return (
    <nav className={cn('flex h-full flex-col', isMobile ? 'p-4' : 'p-2')}>
      <div className={cn('flex h-14 items-center', isMobile ? 'justify-start p-4' : 'justify-center p-4 lg:justify-start')}>
        <Link href="/" className="flex items-center gap-2 font-headline text-2xl tracking-wider text-primary">
          <Newspaper className="h-7 w-7" />
          <span className={cn(!isMobile && 'hidden lg:block')}>NewsBaaz</span>
        </Link>
      </div>
      <Separator className="my-2" />
      <div className="flex-1 overflow-y-auto">
        <ul className="space-y-2 px-2 py-4">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <Button
                  variant={pathname === item.href ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator className="my-2" />
      <div className="p-2">
        <Link href="/login">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogIn className="h-5 w-5" />
            <span>Login / Sign Up</span>
          </Button>
        </Link>
      </div>
    </nav>
  );
}
