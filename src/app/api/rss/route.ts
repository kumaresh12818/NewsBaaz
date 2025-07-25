
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
  bn: {
    'Nation-And-World': 'https://bangla.hindustantimes.com/rss/nation-and-worldRSS',
    'Bengal': 'https://bangla.hindustantimes.com/rss/bengalRSS',
    'Kolkata': 'https://bangla.hindustantimes.com/rss/bengal/kolkataRSS',
    'Districts': 'https://bangla.hindustantimes.com/rss/bengal/districtsRSS',
    'Sports': 'https://bangla.hindustantimes.com/rss/sportsRSS',
    'Cricket': 'https://bangla.hindustantimes.com/rss/cricketRSS',
    'Entertainment': 'https://bangla.hindustantimes.com/rss/entertainmentRSS',
    'Astrology': 'https://bangla.hindustantimes.com/rss/astrologyRSS',
    'Career': 'https://bangla.hindustantimes.com/rss/careerRSS',
    'Pictures': 'https://bangla.hindustantimes.com/rss/picturesRSS',
    'Videos': 'https://bangla.hindustantimes.com/rss/videosRSS',
    'LifeStyle': 'https://bangla.hindustantimes.com/rss/lifestyleRSS',
    'Technology': 'https://bangla.hindustantimes.com/rss/technology',
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
    
    // Add the category and source to each item before returning
    const source = lang === 'bn' ? 'Hindustan Times Bangla' : 'Times of India';
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
