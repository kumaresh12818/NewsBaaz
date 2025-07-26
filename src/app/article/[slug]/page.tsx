import { notFound } from 'next/navigation';
import Image from 'next/image';
import { allArticles } from '@/lib/mock-data';
import { AppLayout } from '@/components/layout/app-layout';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar, User } from 'lucide-react';
import { ArticleAnalysis } from '@/components/article-analysis';
import type { Article } from '@/lib/types';

async function getArticleFromSlug(slug: string): Promise<Article | undefined> {
  return allArticles.find((article) => article.slug === slug);
}

export async function generateStaticParams() {
  return allArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleFromSlug(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <AppLayout>
      <div className="flex-1">
        <article className="container mx-auto max-w-4xl py-8 px-4">
          <div className="space-y-4">
            <Badge variant="outline" className="border-primary text-primary">{article.category}</Badge>
            <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-bold tracking-wide text-foreground">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              {article.source && <span className='font-medium'>{article.source}</span>}
            </div>
          </div>

          <div className="relative my-8 h-64 md:h-96 w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={article.imageUrl}
              alt={article.title}
              data-ai-hint={article.imageHint}
              fill
              className="object-cover"
            />
          </div>

          <div className="prose prose-invert max-w-none font-body text-lg leading-relaxed text-foreground/90">
            <p>{article.content}</p>
          </div>
          
          <Separator className="my-8" />

          <ArticleAnalysis articleContent={article.content} />
          
        </article>
      </div>
    </AppLayout>
  );
}
