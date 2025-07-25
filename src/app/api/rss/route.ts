import { NextResponse, NextRequest } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const rssFeeds: { [key: string]: string } = {
  'Top Stories': 'http://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  'Recent Stories': 'http://timesofindia.indiatimes.com/rssfeedmostrecent.cms',
  'India': 'http://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
  'World': 'http://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
  'Sports': 'http://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
  'Cricket': 'http://timesofindia.indiatimes.com/rssfeeds/54829575.cms',
  'Education': 'http://timesofindia.indiatimes.com/rssfeeds/913168846.cms',
  'Science': 'http://timesofindia.indiatimes.com/rssfeeds/5123168.cms',
  'Business': 'http://timesofindia.indiatimes.com/rssfeeds/1898055.cms',
  'Technology': 'http://timesofindia.indiatimes.com/rssfeeds/671208.cms',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category') || 'Top Stories';
  const feedUrl = rssFeeds[category];

  if (!feedUrl) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    
    // Add the category to each item before returning
    const itemsWithCategory = feed.items.map(item => ({
      ...item,
      category: category,
    }));

    return NextResponse.json(itemsWithCategory);
  } catch (error) {
    console.error(`Failed to fetch RSS feed for ${category}:`, error);
    return NextResponse.json({ error: `Failed to fetch RSS feed for ${category}` }, { status: 500 });
  }
}
