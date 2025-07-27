
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/types';
import { RefreshCw, Camera } from 'lucide-react';
import { fetchArticles } from '@/lib/rss-parser';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

export default function PhotographyPage() {
  const { selectedLang } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  
  useEffect(() => {
    const getArticles = async () => {
      if (refreshTrigger === 0) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const fetchedArticles = await fetchArticles('ALL', selectedLang, 'photography');
        setArticles(fetchedArticles);
        if (refreshTrigger > 0) {
          toast({ title: "Feed updated!" });
        }
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
        toast({ variant: "destructive", title: "Error", description: "Failed to fetch articles." });
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    getArticles();
    
  }, [refreshTrigger, toast, selectedLang]);

  const handleRefresh = () => {
    setRefreshTrigger(t => t + 1);
  };
  
  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary flex items-center gap-3 glass rounded-lg px-4 py-2 shadow-lg shadow-cyan-500/50">
                <Camera className="h-10 w-10" />
                Photography
              </h1>
               <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} className='glass shadow-lg shadow-cyan-500/50'>
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh Photos</span>
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-60 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
              {articles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} displayImage={true} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
