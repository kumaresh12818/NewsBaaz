
'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import type { Article } from '@/lib/types';

interface BookmarkContextType {
  bookmarkedArticles: Article[];
  addBookmark: (article: Article) => void;
  removeBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: ReactNode }) {
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Article[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const item = window.localStorage.getItem('bookmarkedArticles');
      return item ? JSON.parse(item) : [];
    } catch (error) {
      console.error(error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('bookmarkedArticles', JSON.stringify(bookmarkedArticles));
    } catch (error) {
      console.error(error);
    }
  }, [bookmarkedArticles]);

  const addBookmark = (article: Article) => {
    setBookmarkedArticles((prev) => {
      if (prev.find(a => a.id === article.id)) {
        return prev;
      }
      return [...prev, article];
    });
  };

  const removeBookmark = (articleId: string) => {
    setBookmarkedArticles((prev) => prev.filter((article) => article.id !== articleId));
  };

  const isBookmarked = (articleId: string) => {
    return bookmarkedArticles.some((article) => article.id === articleId);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarkedArticles, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmark() {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
}
