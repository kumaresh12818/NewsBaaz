
import type { Article } from './types';
import type { Item } from 'rss-parser';

function extractImageUrl(content: string, item: any, source: string): string {
  const checkUrl = (url: string) => (url && !url.endsWith('.swf') && !url.endsWith('.mp3') ? url : null);

  let imageUrl = checkUrl(item.enclosure?.url);
  if (imageUrl) return imageUrl;

  imageUrl = checkUrl(item['media:content']?.['$']?.url);
  if (imageUrl) return imageUrl;

  imageUrl = checkUrl(item['media:thumbnail']?.['$']?.url);
  if (imageUrl) return imageUrl;
  
  if (item.content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = item.content.match(imgRegex);
    if (match) {
        imageUrl = checkUrl(match[1]);
        if (imageUrl) return imageUrl;
    }
  }

  // ABP live specific
  if (source === 'ABP Live' && content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    if (match) {
        imageUrl = checkUrl(match[1]);
        if (imageUrl) return imageUrl;
    }
  }

  // Hindustan Times Bangla
  if (source === 'Hindustan Times' && content) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    if (match) {
        imageUrl = checkUrl(match[1]);
        if (imageUrl) return imageUrl;
    }
  }
  
  if (source === 'This is Colossal') {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = content.match(imgRegex);
    if (match) {
        imageUrl = checkUrl(match[1]);
        if (imageUrl) return imageUrl;
    }
  }


  return 'https://placehold.co/600x400.png';
}

function cleanSource(source: string): string {
  const sourcesToBlank = [
    'Times of India',
    'ABP Live',
  ];

  if (sourcesToBlank.some(s => source.includes(s))) {
    return '';
  }

  return source;
}

function cleanTitle(title: string): string {
  return title.replace(/recent uploads tagged nature/i, '').trim();
}

function getImageHint(section: string): string {
  switch (section) {
    case 'photography':
      return 'photography camera';
    case 'journals':
      return 'science abstract';
    case 'news':
    default:
      return 'news article';
  }
}

export async function fetchArticles(
  category: string,
  lang: string = 'en',
  section: string = 'news'
): Promise<Article[]> {
  try {
    const response = await fetch(
      `/api/rss?section=${section}&category=${encodeURIComponent(category)}&lang=${lang}`
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch articles: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const items: (Item & {category: string, source: string})[] = await response.json();
    
    return items.map((item, index) => {
      const imageUrl = extractImageUrl(item.content || '', item, item.source);
      const summary = item.contentSnippet || 'No summary available.';
      const cleanSummary = summary.replace(/<[^>]*>?/gm, '');
      const id = item.guid || item.link || `${item.title}-${index}`;

      return {
        id: id,
        slug: item.link ? new URL(item.link).pathname.split('/').pop()! : `article-${id}`,
        title: cleanTitle(item.title || 'No title'),
        author: item.creator || item.source,
        source: cleanSource(item.source || ''),
        publishedAt: item.isoDate || new Date().toISOString(),
        category: item.category,
        imageUrl: imageUrl,
        imageHint: getImageHint(section),
        content: item.contentSnippet || item.content || 'No content available.',
        summary: cleanSummary,
        sentiment: 'Positive', // Placeholder sentiment
        link: item.link || '#',
      };
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return [];
  }
}
