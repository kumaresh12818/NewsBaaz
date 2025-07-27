
'use client';

import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bookmark, Wand2, Loader2, X, AlertTriangle } from 'lucide-react';
import { useBookmark } from '@/context/bookmark-context';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { summarizeArticle, SummarizeArticleOutput } from '@/ai/flows/summarize-article';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/user-context';
import Link from 'next/link';

interface ArticleCardProps {
  article: Article;
  lang?: string;
  displayImage?: boolean;
}

export function ArticleCard({ article, lang, displayImage = true }: ArticleCardProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmark();
  const { user } = useUser();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [analysis, setAnalysis] = useState<SummarizeArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const bookmarked = isBookmarked(article.id);

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  const handleSummarizeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const contentToSummarize = article.content || article.summary;
    if (!contentToSummarize || contentToSummarize.trim() === '' || contentToSummarize === 'No content available.') {
      toast({
        title: 'AI summary is not available',
      });
      return;
    }

    setIsSummaryOpen(true);
    if (analysis) return;

    setIsLoading(true);
    try {
      const language = lang === 'bn' ? 'Bengali' : 'English';
      const result = await summarizeArticle({ articleContent: contentToSummarize, language });
      setAnalysis(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
      setIsSummaryOpen(false); // Close dialog on error
    } finally {
      setIsLoading(false);
    }
  };

  const showImage = displayImage && lang !== 'bn';

  return (
    <>
      <Card className="h-full glass overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 flex flex-col shadow-lg shadow-cyan-500/50">
        {showImage && (
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block"
          >
            <CardHeader className="p-0">
              <div className="relative h-48 w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  data-ai-hint={article.imageHint}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </CardHeader>
          </a>
        )}
        <CardContent className="p-4 space-y-2 flex-grow flex flex-col justify-between">
          <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
          >
              <h3 className="font-headline text-xl leading-tight text-foreground group-hover:underline break-words">
                {article.title}
              </h3>
          </a>
          <div className="flex justify-between items-center pt-2">
              {article.source && <p className="text-muted-foreground text-xs">{article.source}</p>}
              <div className="ml-auto flex items-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleSummarizeClick}
                    title="Summarize Article"
                >
                    <Wand2 className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    onClick={handleBookmarkClick}
                    title="Bookmark Article"
                >
                    <Bookmark className={`h-5 w-5 ${bookmarked ? 'text-red-500 fill-red-500' : ''}`} />
                </Button>
              </div>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-start">
              <span className='max-w-xs'>AI Summary</span>
            </DialogTitle>
            <DialogDescription>
              A quick summary of the article "{article.title}".
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div>
              <p className="text-foreground/90 leading-relaxed">{analysis?.summary}</p>
            </div>
          )}
           <DialogFooter>
            <Button variant="outline" onClick={() => setIsSummaryOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-primary" />
              Authentication Required
            </DialogTitle>
            <DialogDescription>
              You need to be logged in to bookmark articles.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:justify-center">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
