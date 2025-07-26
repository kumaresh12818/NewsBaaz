import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  lang?: string;
}

export function ArticleCard({ article, lang }: ArticleCardProps) {
  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block h-full"
    >
      <Card className="h-full glass overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1">
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
        <CardContent className="p-4 space-y-2">
            <h3 className="font-headline text-xl leading-tight text-foreground group-hover:underline break-words">
              {article.title}
            </h3>
          <p className="text-muted-foreground text-sm line-clamp-3 break-words">{article.summary}</p>
        </CardContent>
      </Card>
    </a>
  );
}
