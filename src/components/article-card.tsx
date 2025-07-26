import Image from 'next/image';
import type { Article } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Bookmark } from 'lucide-react';
import { useBookmark } from '@/context/bookmark-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ArticleCardProps {
  article: Article;
  lang?: string;
}

export function ArticleCard({ article, lang }: ArticleCardProps) {
  const { isBookmarked, addBookmark, removeBookmark } = useBookmark();
  const { toast } = useToast();
  const bookmarked = isBookmarked(article.id);

  const handleBookmarkClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (bookmarked) {
      removeBookmark(article.id);
      toast({ title: "Bookmark removed" });
    } else {
      addBookmark(article);
      toast({ title: "Bookmark added" });
    }
  };

  return (
    <Card className="h-full glass overflow-hidden transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:-translate-y-1 flex flex-col">
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
            <Button
                variant="ghost"
                size="icon"
                className="rounded-full ml-auto"
                onClick={handleBookmarkClick}
            >
                <Bookmark className={`h-5 w-5 ${bookmarked ? 'text-primary fill-primary' : ''}`} />
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
