'use client';

import React, { useState, useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppHeader } from './header';
import { SidebarNav } from './sidebar-nav';
import { MobileNav } from './mobile-nav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-dashed border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="hidden md:flex md:flex-col md:border-r glass">
          <SidebarNav />
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <AppHeader />
          <SidebarInset className="flex-1">
            <main className="flex-1 overflow-y-auto">{children}</main>
          </SidebarInset>
        </div>
      </div>
      <MobileNav />
    </SidebarProvider>
  );
}
