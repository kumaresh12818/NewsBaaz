
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/types';
import { Bookmark } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import { useBookmark } from '@/context/bookmark-context';

export default function BookmarksPage() {
  const { selectedLang } = useLanguage();
  const { bookmarkedArticles } = useBookmark();

  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary flex items-center gap-3">
              <Bookmark className="h-10 w-10" />
              My Bookmarks
            </h1>
          </div>

          {bookmarkedArticles.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {bookmarkedArticles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} lang={selectedLang} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
              <Bookmark className="h-16 w-16 text-muted-foreground" />
              <h2 className="mt-4 text-2xl font-semibold">No Bookmarks Yet</h2>
              <p className="mt-2 text-muted-foreground">
                You haven&apos;t saved any articles.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
