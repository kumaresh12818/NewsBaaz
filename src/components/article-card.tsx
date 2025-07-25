import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
}

const sentimentColors = {
  Positive: 'bg-green-500/20 text-green-400 border-green-500/30',
  Negative: 'bg-red-500/20 text-red-400 border-red-500/30',
  Neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="group relative block">
      <Card className="h-full glass overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Link href={`/article/${article.slug}`} className="absolute inset-0 z-10" aria-label={`Read more about ${article.title}`}>
                <span className="sr-only">Read more</span>
            </Link>
            <Image
              src={article.imageUrl}
              alt={article.title}
              data-ai-hint={article.imageHint}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-2">
            <Link href={`/article/${article.slug}`} className="font-headline text-xl leading-tight text-foreground hover:underline">
              {article.title}
            </Link>
          <p className="text-muted-foreground text-sm line-clamp-3">{article.summary}</p>
        </CardContent>
        <CardFooter className="p-4 flex justify-between items-center">
          <Badge
            className={cn('text-xs font-bold uppercase tracking-wider', sentimentColors[article.sentiment])}
          >
            {article.sentiment}
          </Badge>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary z-20"
            onClick={(e) => e.stopPropagation()}
          >
            {article.source}
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}
