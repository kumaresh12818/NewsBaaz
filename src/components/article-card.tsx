
'use client';

import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bookmark, Wand2, Loader2, X } from 'lucide-react';
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
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';


interface ArticleCardProps {
  article: Article;
  lang?: string;
}

const sentimentColors: { [key: string]: string } = {
  Positive: 'bg-green-500/20 text-green-400 border-green-500/30',
  Negative: 'bg-red-500/20 text-red-400 border-red-500/30',
};


export function ArticleCard({ article, lang }: ArticleCardProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmark();
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [analysis, setAnalysis] = useState<SummarizeArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();


  const bookmarked = isBookmarked(article.id);

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(article.id);
    } else {
      addBookmark(article);
    }
  };

  const handleSummarizeClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSummaryOpen(true);
    if (analysis) return;

    setIsLoading(true);
    try {
      const result = await summarizeArticle({ articleContent: article.content || article.summary });
      setAnalysis(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'The AI analysis could not be completed. Please try again.',
      });
      setIsSummaryOpen(false); // Close dialog on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Card className="h-full glass overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 flex flex-col shadow-lg shadow-cyan-500/50">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block"
        >
          {lang !== 'bn' && (
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
          )}
        </a>
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
              <span className='max-w-xs'>AI Summary & Analysis</span>
              {analysis && (
                <Badge
                  className={cn('text-sm font-bold', sentimentColors[analysis.sentiment] || sentimentColors.Negative)}
                >
                  {analysis.sentiment}
                </Badge>
              )}
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
    </>
  );
}
