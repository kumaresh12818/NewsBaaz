
'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/layout/app-layout';
import { ArticleCard } from '@/components/article-card';
import type { Article } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
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

const allCategories: { [lang: string]: string[] } = {
  en: [
    'Top Stories',
    'Recent Stories',
    'India',
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
    'Nation-And-World',
    'Bengal',
    'Kolkata',
    'Districts',
    'Sports',
    'Cricket',
    'Entertainment',
    'Astrology',
  ],
};


export default function Home() {
  const { selectedLang } = useLanguage();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = allCategories[selectedLang];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // When language changes, update the selected category to a valid one for the new language.
    const newCategories = allCategories[selectedLang];
    if (!newCategories.includes(selectedCategory)) {
        setSelectedCategory(newCategories[0]);
    }
  }, [selectedLang, selectedCategory]);

  useEffect(() => {
    const getArticles = async () => {
      // Don't fetch if we're already fetching
      if (isFetchingRef.current) {
        return;
      }
      
      const currentCategories = allCategories[selectedLang];
      // Ensure the selected category is valid for the current language before fetching
      if (!currentCategories.includes(selectedCategory)) {
        // This can happen during transition, just wait for the category to be updated.
        return;
      }

      isFetchingRef.current = true;
      setIsLoading(true);
      try {
        const fetchedArticles = await fetchArticles(selectedCategory, selectedLang);
        setArticles(fetchedArticles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
        setArticles([]);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    };
    getArticles();
  }, [selectedCategory, selectedLang]);


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
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <h1 className="text-4xl md:text-5xl font-headline tracking-wider text-primary">
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
          </div>
        </div>
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredArticles.map((article: Article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
