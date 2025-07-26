
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search, RefreshCw, Newspaper } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { fetchArticles } from '@/lib/rss-parser';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const allCategories: { [lang: string]: string[] } = {
  en: [
    'Top Stories',
    'Recent Stories',
    'India',
    'KOLKATA',
    'World',
    'Business',
    'Sports',
    'Cricket',
    'Science',
    'Technology',
    'Education',
    'Entertainment',
    'Astrology',
  ],
  bn: [
    'India News',
    'District News',
    'Kolkata',
    'States',
    'World News',
    'Sports',
    'ENTERTAINMENT',
    'Astro',
    'Business',
  ]
};

export default function Home() {
  const { selectedLang, handleLanguageChange: setGlobalLang } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [categories, setCategories] = useState(allCategories[selectedLang]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    // On first load for a guest, if no preferences are set,
    // they see the default news feed. If they've onboarded,
    // their language preference is loaded by LanguageProvider.
    const storedPrefs = localStorage.getItem('userPreferences');
    if (storedPrefs) {
      const parsedPrefs = JSON.parse(storedPrefs);
      if (parsedPrefs.lang && parsedPrefs.lang !== selectedLang) {
        setGlobalLang(parsedPrefs.lang);
      }
      if (parsedPrefs.categories && parsedPrefs.categories.length > 0) {
        // You could optionally set the default category from user prefs,
        // but for now, we'll just respect the language.
        const newCategories = allCategories[parsedPrefs.lang];
        setCategories(newCategories);
        if (!newCategories.includes(selectedCategory)) {
          setSelectedCategory(newCategories[0]);
        }
      }
    }
  }, []);
  
  useEffect(() => {
    const newCategories = allCategories[selectedLang];
    setCategories(newCategories);

    let categoryToFetch = selectedCategory;

    if (!newCategories.includes(selectedCategory)) {
      categoryToFetch = newCategories[0];
      setSelectedCategory(categoryToFetch);
    } else {
        const getArticles = async () => {
          if (refreshTrigger === 0) {
            setIsLoading(true);
          } else {
            setIsRefreshing(true);
          }
    
          try {
            const fetchedArticles = await fetchArticles(categoryToFetch, selectedLang, 'news');
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

        if (categoryToFetch) {
            getArticles();
        }
    }
    
  }, [selectedLang, selectedCategory, refreshTrigger, toast]);

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
  
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };
  
  return (
    <AppLayout>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="container max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary flex items-center gap-3 glass rounded-lg px-4 py-2 shadow-lg shadow-cyan-500/50">
              <Newspaper className="h-10 w-10" />
              {selectedCategory}
            </h1>
            <div className="flex w-full md:w-auto items-center space-x-2">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
