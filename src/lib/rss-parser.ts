import Parser from 'rss-parser';
import { Article } from './types';

const parser = new Parser();

const RSS_FEED_URL = 'http://timesofindia.indiatimes.com/rssfeedstopstories.cms';

function extractImageUrl(content: string): string {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    return match ? match[1] : 'https://placehold.co/600x400.png';
  }

export async function fetchArticles(): Promise<Article[]> {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    return feed.items.map((item, index) => {
        const imageUrl = item.enclosure?.url || extractImageUrl(item.content || '');
        return {
          id: item.guid || index.toString(),
          slug: item.link ? new URL(item.link).pathname.split('/').pop()! : `article-${index}`,
          title: item.title || 'No title',
          author: item.creator || 'Times of India',
          source: 'Times of India',
          publishedAt: item.isoDate || new Date().toISOString(),
          category: item.categories?.[0] || 'Top Stories',
          imageUrl: imageUrl,
          imageHint: 'news article',
          content: item.contentSnippet || item.content || 'No content available.',
          summary: item.contentSnippet || 'No summary available.',
          sentiment: 'Neutral', // Placeholder sentiment
        };
      });
  } catch (error) {
    console.error('Failed to fetch articles from RSS feed:', error);
    return [];
  }
}
