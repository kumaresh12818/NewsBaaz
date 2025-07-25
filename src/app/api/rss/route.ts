import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const RSS_FEED_URL = 'http://timesofindia.indiatimes.com/rssfeedstopstories.cms';

export async function GET() {
  try {
    const feed = await parser.parseURL(RSS_FEED_URL);
    return NextResponse.json(feed.items);
  } catch (error) {
    console.error('Failed to fetch RSS feed:', error);
    return NextResponse.json({ error: 'Failed to fetch RSS feed' }, { status: 500 });
  }
}
