'use server';

/**
 * @fileOverview An AI agent to analyze the sentiment of a news article.
 *
 * - analyzeArticleSentiment - A function that handles the sentiment analysis process.
 * - AnalyzeArticleSentimentInput - The input type for the analyzeArticleSentiment function.
 * - AnalyzeArticleSentimentOutput - The return type for the analyzeArticleSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeArticleSentimentInputSchema = z.object({
  articleContent: z
    .string()
    .describe('The content of the article to analyze for sentiment.'),
});
export type AnalyzeArticleSentimentInput = z.infer<
  typeof AnalyzeArticleSentimentInputSchema
>;

const AnalyzeArticleSentimentOutputSchema = z.object({
  sentiment:
    z.enum(['positive', 'negative']).describe('The sentiment of the article: positive or negative.'),
  summary: z.string().describe('A short summary of the article.'),
});
export type AnalyzeArticleSentimentOutput = z.infer<
  typeof AnalyzeArticleSentimentOutputSchema
>;

export async function analyzeArticleSentiment(
  input: AnalyzeArticleSentimentInput
): Promise<AnalyzeArticleSentimentOutput> {
  return analyzeArticleSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeArticleSentimentPrompt',
  input: {schema: AnalyzeArticleSentimentInputSchema},
  output: {schema: AnalyzeArticleSentimentOutputSchema},
  prompt: `You are a news analyst tasked with determining the sentiment of news articles.
  Analyze the following article content and determine if the sentiment is positive or negative.
  Also, provide a short summary of the article.

  Article Content: {{{articleContent}}}

  Respond with the sentiment and summary in the following JSON format:
  {
    "sentiment": "positive | negative",
    "summary": "A short summary of the article."
  }`,
});

const analyzeArticleSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeArticleSentimentFlow',
    inputSchema: AnalyzeArticleSentimentInputSchema,
    outputSchema: AnalyzeArticleSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
