
'use client';

import { Globe, Menu, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarNav } from './sidebar-nav';
import Link from 'next/link';
import { mockUser } from '@/lib/mock-data';
import { useLanguage } from '@/context/language-context';
import { ThemeToggle } from '../theme-toggle';

export function AppHeader() {
  const { handleLanguageChange } = useLanguage();

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/60 px-4 backdrop-blur-lg md:px-6">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="glass p-0">
             <SheetHeader className='p-4'>
               <SheetTitle className='sr-only'>Mobile Navigation Menu</SheetTitle>
            </SheetHeader>
            <SidebarNav isMobile={true} />
          </SheetContent>
        </Sheet>
      </div>
      
      <div className="hidden md:flex flex-1 items-center">
        <Link href="/" className="flex items-center gap-2 font-headline text-2xl tracking-wider text-primary">
          <Newspaper className="h-7 w-7" />
          <span>NewsBlend</span>
        </Link>
      </div>
      
      <div className="flex w-full items-center justify-end gap-4">
        <ThemeToggle />
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Globe className="h-5 w-5" />
                <span className="sr-only">Select Language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => handleLanguageChange('en')}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => handleLanguageChange('bn')}>
                Bengali
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={mockUser.avatarUrl} alt={mockUser.name} />
                <AvatarFallback>{mockUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">Logout</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
