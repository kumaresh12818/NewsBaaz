import type { Article } from './types';
import type { Item } from 'rss-parser';

function extractImageUrl(content: string): string {
  const imgRegex = /<img[^>]+src="([^">]+)"/;
  const match = content.match(imgRegex);
  return match ? match[1] : 'https://placehold.co/600x400.png';
}

export async function fetchArticles(category = 'Top Stories'): Promise<Article[]> {
  try {
    const response = await fetch(`/api/rss?category=${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    const items: (Item & {category: string})[] = await response.json();
    
    return items.map((item, index) => {
      const imageUrl = item.enclosure?.url || extractImageUrl(item.content || '');
      return {
        id: item.guid || index.toString(),
        slug: item.link ? new URL(item.link).pathname.split('/').pop()! : `article-${index}`,
        title: item.title || 'No title',
        author: item.creator || 'Times of India',
        source: 'Times of India',
        publishedAt: item.isoDate || new Date().toISOString(),
        category: item.category,
        imageUrl: imageUrl,
        imageHint: 'news article',
        content: item.contentSnippet || item.content || 'No content available.',
        summary: item.contentSnippet || 'No summary available.',
        sentiment: 'Neutral', // Placeholder sentiment
        link: item.link || '#',
      };
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}
