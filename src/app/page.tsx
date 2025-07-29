
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/types';
import { RefreshCw } from 'lucide-react';
import { fetchArticles } from '@/lib/rss-parser';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const newsCategories = {
  en: [
    'Top Stories', 'Recent Stories', 'India', 'KOLKATA', 'World', 'Business', 
    'Sports', 'Cricket', 'Science', 'Technology', 'Education', 'Entertainment', 'Astrology'
  ],
  bn: [
    'India News', 'District News', 'Kolkata', 'States', 'World News', 
    'Sports', 'ENTERTAINMENT', 'Astro', 'Business', 'Fact Check', 'Health', 'Trending', 'Election',
    'জাতি', 'বিশ্ব', 'কলকাতা', 'জেলা', 'খেলাধুলা', 'বিনোদন', 'ব্লগ', 'স্বাস্থ্য', 'লাইফস্টাইল'
  ]
};

export default function Home() {
  const { selectedLang } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  
  const categories = useMemo(() => newsCategories[selectedLang as 'en' | 'bn'], [selectedLang]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  // When language changes, update the category to the first available one for the new language.
  useEffect(() => {
    const newDefaultCategory = newsCategories[selectedLang as 'en' | 'bn'][0];
    setSelectedCategory(newDefaultCategory);
  }, [selectedLang]);

  useEffect(() => {
    const getArticles = async () => {
      // Ensure the category is valid for the current language before fetching
      const currentCategories = newsCategories[selectedLang as 'en' | 'bn'];
      if (!currentCategories.includes(selectedCategory)) {
        // If not, it means the state hasn't updated yet. We can either wait or just not fetch.
        // Let's not fetch to prevent the error. The category change effect will trigger a re-render and a new fetch.
        return;
      }

      if (refreshTrigger === 0) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      try {
        const fetchedArticles = await fetchArticles(selectedCategory, selectedLang, 'news');
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
    
  }, [selectedLang, selectedCategory, refreshTrigger, toast]);

  const handleRefresh = () => {
    setRefreshTrigger(t => t + 1);
  };
  
  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary flex items-center gap-3 glass rounded-lg px-4 py-2 shadow-lg shadow-cyan-500/50">
              {selectedCategory}
            </h1>
            <div className="flex w-full md:w-auto items-center space-x-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px] glass shadow-lg shadow-cyan-500/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className='glass'>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isRefreshing} className='glass shadow-lg shadow-cyan-500/50'>
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="sr-only">Refresh News</span>
              </Button>
            </div>
          </div>
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-8">
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
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 mt-8">
              {articles.map((article: Article) => (
                <ArticleCard key={article.id} article={article} lang={selectedLang} />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
