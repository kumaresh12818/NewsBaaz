import type { Article } from './types';
import type { Item } from 'rss-parser';

function extractImageUrl(content: string, item: any, source: string): string {
  // For ABP Live (Hindi)
  if (source === 'ABP Live' && item.enclosure?.url) {
    return item.enclosure.url;
  }
  
  if (item.content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = item.content.match(imgRegex);
    if (match) return match[1];
  }
  
  if (item.enclosure?.url) {
    return item.enclosure.url;
  }
  if (item['media:content']?.['$']?.url) {
    return item['media:content']['$'].url;
  }
  if (item['media:thumbnail']?.['$']?.url) {
    return item['media:thumbnail']['$'].url;
  }
  
  return 'https://placehold.co/600x400.png';
}

export async function fetchArticles(category: string, lang: string = 'en'): Promise<Article[]> {
  try {
    const response = await fetch(`/api/rss?category=${encodeURIComponent(category)}&lang=${lang}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    const items: (Item & {category: string, source: string})[] = await response.json();
    
    return items.map((item, index) => {
      const imageUrl = extractImageUrl(item.content || '', item, item.source);
      const summary = item.contentSnippet || 'No summary available.';
      return {
        id: item.guid || item.link || index.toString(),
        slug: item.link ? new URL(item.link).pathname.split('/').pop()! : `article-${index}`,
        title: item.title || 'No title',
        author: item.creator || item.source,
        source: item.source,
        publishedAt: item.isoDate || new Date().toISOString(),
        category: item.category,
        imageUrl: imageUrl,
        imageHint: 'news article',
        content: item.contentSnippet || item.content || 'No content available.',
        summary: summary,
        sentiment: 'Neutral', // Placeholder sentiment
        link: item.link || '#',
      };
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}
