
import { NextResponse, NextRequest } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const rssFeeds: { [lang: string]: { [category: string]: string } } = {
  en: {
    'Top Stories': 'http://timesofindia.indiatimes.com/rssfeedstopstories.cms',
    'Recent Stories': 'http://timesofindia.indiatimes.com/rssfeedmostrecent.cms',
    'India': 'http://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
    'World': 'http://timesofindia.indiatimes.com/rssfeeds/296589292.cms',
    'Business': 'http://timesofindia.indiatimes.com/rssfeeds/1898055.cms',
    'Sports': 'http://timesofindia.indiatimes.com/rssfeeds/4719148.cms',
    'Cricket': 'http://timesofindia.indiatimes.com/rssfeeds/54829575.cms',
    'Science': 'http://timesofindia.indiatimes.com/rssfeeds/-2128672765.cms',
    'Technology': 'http://timesofindia.indiatimes.com/rssfeeds/66949542.cms',
    'Education': 'http://timesofindia.indiatimes.com/rssfeeds/913168846.cms',
    'Entertainment': 'http://timesofindia.indiatimes.com/rssfeeds/1081479906.cms',
    'Astrology': 'https://timesofindia.indiatimes.com/rssfeeds/65857041.cms',
  },
  hi: {
    'India News': 'https://www.abplive.com/news/india/feed',
    'World News': 'https://www.abplive.com/news/world/feed',
    'States': 'https://www.abplive.com/states/feed',
    'Sports': 'https://www.abplive.com/sports/feed',
    'Bollywood': 'https://www.abplive.com/entertainment/bollywood/feed',
    'Television': 'https://www.abplive.com/entertainment/television/feed',
    'Tamil Cinema': 'https://www.abplive.com/entertainment/tamil-cinema/feed',
    'Bhojpuri Cinema': 'https://www.abplive.com/entertainment/bhojpuri-cinema/feed',
    'Astro': 'https://www.abplive.com/astro/feed',
    'Religion': 'https://www.abplive.com/lifestyle/religion/feed',
    'Business': 'https://www.abplive.com/business/feed',
    'Gadgets': 'https://www.abplive.com/technology/gadgets/feed',
    'Life Style': 'https://www.abplive.com/lifestyle/feed',
    'Health': 'https://www.abplive.com/lifestyle/health/feed',
    'Technology': 'https://www.abplive.com/technology/feed',
    'Education': 'https://www.abplive.com/education/feed',
    'Jobs': 'https://www.abplive.com/education/jobs/feed',
    'Coronavirus': 'https://www.abplive.com/latest-news/coronavirus/feed',
    'Agricultures': 'https://www.abplive.com/agriculture/feed',
    'GK': 'https://www.abplive.com/gk/feed',
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lang = searchParams.get('lang') || 'en';
  const category = searchParams.get('category');

  const langFeeds = rssFeeds[lang];
  if (!langFeeds) {
    return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
  }
  
  const defaultCategory = Object.keys(langFeeds)[0];
  const finalCategory = category || defaultCategory;
  const feedUrl = langFeeds[finalCategory];
  
  if (!feedUrl) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    
    let source = 'Times of India';
    if (lang === 'hi') {
      source = 'ABP Live';
    }
    
    const itemsWithCategory = feed.items.map(item => ({
      ...item,
      category: finalCategory,
      source: source,
    }));

    return NextResponse.json(itemsWithCategory);
  } catch (error) {
    console.error(`Failed to fetch RSS feed for ${finalCategory} (${lang}):`, error);
    return NextResponse.json({ error: `Failed to fetch RSS feed for ${finalCategory}` }, { status: 500 });
  }
}
