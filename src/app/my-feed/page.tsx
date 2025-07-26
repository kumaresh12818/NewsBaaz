
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, Rss } from 'lucide-react';
import { fetchArticles } from '@/lib/rss-parser';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function MyFeedPage() {
  const { selectedLang, handleLanguageChange } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<{ lang: string, categories: string[] } | null>(null);
  const [isReadyToFetch, setIsReadyToFetch] = useState(false);

  useEffect(() => {
    const storedPrefs = localStorage.getItem('userPreferences');
    if (storedPrefs) {
      const parsedPrefs = JSON.parse(storedPrefs);
      setPreferences(parsedPrefs);
      if (parsedPrefs.lang !== selectedLang) {
        handleLanguageChange(parsedPrefs.lang);
      } else {
        // If languages match, we are ready to fetch
        setIsReadyToFetch(true);
      }
    } else {
        setIsLoading(false); // No prefs, stop loading
    }
  }, []);

  // This effect ensures we only mark as ready to fetch when the language context has updated.
  useEffect(() => {
      if (preferences && preferences.lang === selectedLang) {
          setIsReadyToFetch(true);
      }
  }, [selectedLang, preferences])


  useEffect(() => {
    const getArticles = async () => {
      if (!isReadyToFetch || !preferences || preferences.categories.length === 0) {
        if(!preferences) setIsLoading(false);
        return;
      }
      
      if (refreshTrigger === 0) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const promises = preferences.categories.map((category: string) => 
          fetchArticles(category, preferences.lang, 'news')
        );
        const results = await Promise.all(promises);
        const combinedArticles = results.flat();
        
        // Remove duplicates based on the link
        const uniqueArticles = Array.from(new Map(combinedArticles.map(item => [item.link, item])).values());
        
        uniqueArticles.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
          return dateB - dateA;
        });

        setArticles(uniqueArticles);

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

    if (isReadyToFetch) {
        getArticles();
    }
    
  }, [preferences, refreshTrigger, toast, isReadyToFetch]);

  const handleRefresh = () => {
    setRefreshTrigger(t => t + 1);
  };
  
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (article.summary && article.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [searchTerm, articles]);
  
  if (!isLoading && (!preferences || preferences.categories.length === 0)) {
    return (
      <AppLayout>
        <div className="flex-1 space-y-8 p-4 md:p-8">
            <div className="container max-w-3xl mx-auto text-center">
                 <Rss className="h-16 w-16 mx-auto text-primary" />
                <h1 className="mt-4 text-3xl font-headline tracking-wider">Your Feed is Empty</h1>
                <p className="mt-2 text-muted-foreground">
                    You haven't selected any categories yet.
                </p>
                <Button asChild className="mt-4">
                    <a href="/onboarding">Personalize Your Feed</a>
                </Button>
            </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="container max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary flex items-center gap-3">
              <Rss className="h-10 w-10" />
              My Feed
            </h1>
            <div className="flex w-full md:w-auto items-center space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search your feed..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
               <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh News</span>
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-8">
              {filteredArticles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} lang={selectedLang} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
