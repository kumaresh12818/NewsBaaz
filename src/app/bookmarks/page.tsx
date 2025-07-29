
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/types';
import { Bookmark, Newspaper, Camera, BookText } from 'lucide-react';
import { useBookmark } from '@/context/bookmark-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NoBookmarks = ({ section }: { section: string }) => (
  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg mt-8">
    <Bookmark className="h-16 w-16 text-muted-foreground" />
    <h2 className="mt-4 text-2xl font-semibold">No Bookmarks in {section}</h2>
    <p className="mt-2 text-muted-foreground">
      You haven&apos;t saved any articles in this section yet.
    </p>
  </div>
);

export default function BookmarksPage() {
  const { bookmarkedArticles } = useBookmark();

  const newsArticles = bookmarkedArticles.filter(a => a.section === 'news');
  const photographyArticles = bookmarkedArticles.filter(a => a.section === 'photography');
  const journalsArticles = bookmarkedArticles.filter(a => a.section === 'journals');

  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary flex items-center gap-3 glass rounded-lg px-4 py-2 shadow-lg shadow-cyan-500/50">
              <Bookmark className="h-10 w-10" />
              My Bookmarks
            </h1>
          </div>

          <Tabs defaultValue="news" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass">
              <TabsTrigger value="news">
                <Newspaper className="mr-2 h-4 w-4" />
                News
              </TabsTrigger>
              <TabsTrigger value="photography">
                <Camera className="mr-2 h-4 w-4" />
                Photography
              </TabsTrigger>
              <TabsTrigger value="journals">
                <BookText className="mr-2 h-4 w-4" />
                Journals
              </TabsTrigger>
            </TabsList>
            <TabsContent value="news">
              {newsArticles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                  {newsArticles.map((article: Article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <NoBookmarks section="News" />
              )}
            </TabsContent>
            <TabsContent value="photography">
              {photographyArticles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                  {photographyArticles.map((article: Article) => (
                    <ArticleCard key={article.id} article={article} displayImage={true} />
                  ))}
                </div>
              ) : (
                <NoBookmarks section="Photography" />
              )}
            </TabsContent>
            <TabsContent value="journals">
              {journalsArticles.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-8">
                  {journalsArticles.map((article: Article) => (
                    <ArticleCard key={article.id} article={article} displayImage={false} />
                  ))}
                </div>
              ) : (
                <NoBookmarks section="Journals" />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
