import { AppLayout } from '@/components/layout/app-layout';
import { allArticles } from '@/lib/mock-data';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/types';
import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  // In a real app, this would come from user data.
  // Here, we'll just show the first 2 articles as "bookmarked".
  const bookmarkedArticles = allArticles.slice(0, 2);

  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary flex items-center gap-3">
            <Bookmark className="h-10 w-10" />
            My Bookmarks
          </h1>
        </div>

        {bookmarkedArticles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {bookmarkedArticles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
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
    </AppLayout>
  );
}
