
'use client';

import { useState } from 'react';
import { summarizeArticle, SummarizeArticleOutput } from '@/ai/flows/summarize-article';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

interface ArticleAnalysisProps {
  articleContent: string;
}

export function ArticleAnalysis({ articleContent }: ArticleAnalysisProps) {
  const [analysis, setAnalysis] = useState<SummarizeArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { selectedLang } = useLanguage();

  const handleAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const language = selectedLang === 'bn' ? 'Bengali' : 'English';
      const result = await summarizeArticle({ articleContent, language });
      setAnalysis(result);
    } catch (error) {
      console.error('AI analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'The AI analysis could not be completed. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const AIGenerateButton = () => (
    <div className="relative mt-2 ml-2">
      <Button onClick={handleAnalysis} disabled={isLoading}>
        <Wand2 className="mr-2 h-4 w-4" />
        {isLoading ? 'Generating...' : 'Generate Summary'}
      </Button>
      <div className="absolute -left-2 -top-2 -z-10">
        <div className="relative flex h-14 w-[10.5rem] items-center justify-center">
          <div className="color-spinner"></div>
          <div className="absolute inset-0.5 rounded-full bg-background"></div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-6">
      <h2 className="font-headline text-3xl tracking-wider text-primary">AI Analysis</h2>
      <div className="flex flex-col items-start gap-4">
        {!analysis && !isLoading && <AIGenerateButton />}

        {isLoading && <AIGenerateButton />}

        {analysis && !isLoading && (
          <Card className="w-full glass">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Analysis Results</span>
                 <Button variant="ghost" size="sm" onClick={handleAnalysis} disabled={isLoading}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{analysis.summary}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
