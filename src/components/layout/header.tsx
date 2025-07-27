
'use client';

import { Globe, Menu, LogOut } from 'lucide-react';
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
import { useLanguage } from '@/context/language-context';
import { ThemeToggle } from '../theme-toggle';
import { useUser } from '@/context/user-context';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export function AppHeader() {
  const { selectedLang, handleLanguageChange } = useLanguage();
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const isPhotographyPage = pathname === '/photography';

  const toggleLanguage = () => {
    const newLang = selectedLang === 'en' ? 'bn' : 'en';
    handleLanguageChange(newLang);
  };

  const handleLogout = async () => {
    await signOut(auth);
    toast({ title: 'Logged out successfully.' });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center border-b bg-background/60 px-4 backdrop-blur-lg">
      <div className="grid grid-cols-3 items-center w-full">
        {/* Left section */}
        <div className="flex justify-start items-center">
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
        </div>

        {/* Center section */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 font-headline text-2xl tracking-wider text-primary">
            <div className="bg-foreground dark:bg-background rounded-full p-1">
              <Image src="https://i.postimg.cc/zBdV4JGC/Chat-GPT-Image-Jul-26-2025-11-53-49-PM.png" alt="NewsBaaz Logo" width={28} height={28} />
            </div>
            <span className="hidden md:inline">NewsBaaz</span>
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center justify-end gap-2 md:gap-4">
          <ThemeToggle />
          {!isPhotographyPage && (
            <Button variant="outline" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
              <span className="sr-only">Toggle Language</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar>
                  {user ? (
                    <>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </>
                  ) : (
                    <AvatarFallback>G</AvatarFallback>
                  )}
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/signup">Sign Up</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
