'use client';

import { useState } from 'react';
import { summarizeArticle, SummarizeArticleOutput } from '@/ai/flows/summarize-article';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArticleAnalysisProps {
  articleContent: string;
}

export function ArticleAnalysis({ articleContent }: ArticleAnalysisProps) {
  const [analysis, setAnalysis] = useState<SummarizeArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysis = async () => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const result = await summarizeArticle({ articleContent });
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

  return (
    <section className="space-y-6">
      <h2 className="font-headline text-3xl tracking-wider text-primary">AI Analysis</h2>
      <div className="flex flex-col items-start gap-4">
        {!analysis && !isLoading && (
          <Button onClick={handleAnalysis} disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Summary
          </Button>
        )}

        {isLoading && (
          <div className="flex items-center justify-center w-full rounded-lg border-2 border-dashed border-border h-32">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="font-medium">Analyzing article...</span>
            </div>
          </div>
        )}

        {analysis && (
          <Card className="w-full glass">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Analysis Results</span>
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
