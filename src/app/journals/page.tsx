
'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { BookText } from 'lucide-react';

export default function JournalsPage() {
  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary flex items-center gap-3 glass rounded-lg px-4 py-2 shadow-lg shadow-cyan-500/50">
              <BookText className="h-10 w-10" />
              Journals
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-border rounded-lg mt-8">
            <BookText className="h-16 w-16 text-muted-foreground" />
            <h2 className="mt-4 text-2xl font-semibold">Coming Soon</h2>
            <p className="mt-2 text-muted-foreground">
              The Journals section is under construction.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
