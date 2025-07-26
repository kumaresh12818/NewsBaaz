
import { NextResponse, NextRequest } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const rssFeeds: { [key: string]: { [category: string]: string } } = {
  news: {
    en: {
      'Top Stories': 'http://timesofindia.indiatimes.com/rssfeedstopstories.cms',
      'Recent Stories': 'http://timesofindia.indiatimes.com/rssfeedmostrecent.cms',
      'India': 'http://timesofindia.indiatimes.com/rssfeeds/-2128936835.cms',
      'KOLKATA': 'http://timesofindia.indiatimes.com/rssfeeds/-2128830821.cms',
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
      'India News': 'https://bengali.abplive.com/news/india/feed',
      'District News': 'https://bengali.abplive.com/district/feed',
      'Kolkata': 'https://bengali.abplive.com/news/kolkata/feed',
      'States': 'https://bengali.abplive.com/states/feed',
      'World News': 'https://bengali.abplive.com/news/world/feed',
      'Sports': 'https://bengali.abplive.com/sports/feed',
      'ENTERTAINMENT': 'https://bengali.abplive.com/entertainment/feed',
      'Astro': 'https://bengali.abplive.com/astro/feed',
      'Business': 'https://bengali.abplive.com/business/feed',
    }
  },
  photography: {
    'Admiring Light': 'https://admiringlight.com/blog/feed/',
    'DPReview': 'https://www.dpreview.com/feeds/reviews.xml',
    'Digital Photography School': 'https://digital-photography-school.com/feed/',
    'ePHOTOzine': 'https://www.ephotozine.com/full.xml',
    'Fstoppers': 'https://fstoppers.com/feed',
    'Light Stalking': 'https://www.lightstalking.com/feed/',
    'PetaPixel': 'https://petapixel.com/feed/',
    'Phillip Reeve': 'https://phillipreeve.net/blog/feed/',
    'Photography Life': 'https://photographylife.com/feed/',
    'Photofocus': 'https://photofocus.com/feed/',
    'PictureCorrect': 'https://feeds.feedburner.com/picturecorrect',
    'Shutterbug': 'https://www.shutterbug.com/rss.xml',
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const section = searchParams.get('section') || 'news';
  const lang = searchParams.get('lang') || 'en';
  const category = searchParams.get('category');

  let feedsForSection;
  if (section === 'news') {
    feedsForSection = rssFeeds.news[lang as 'en' | 'bn'];
  } else if (section === 'photography') {
    feedsForSection = rssFeeds.photography;
  }

  if (!feedsForSection) {
    return NextResponse.json({ error: 'Invalid section or language' }, { status: 400 });
  }
  
  const defaultCategory = Object.keys(feedsForSection)[0];
  const finalCategory = category || defaultCategory;
  const feedUrl = feedsForSection[finalCategory];
  
  if (!feedUrl) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const feed = await parser.parseURL(feedUrl);
    
    let source = ''; // Removed hardcoded source
    if (lang === 'bn') {
        source = ''; // Removed hardcoded source
    }
    
    const itemsWithCategory = feed.items.map(item => ({
      ...item,
      category: finalCategory,
      source: feed.title || '',
    }));

    return NextResponse.json(itemsWithCategory);
  } catch (error) {
    console.error(`Failed to fetch RSS feed for ${finalCategory} (${section}/${lang}):`, error);
    return NextResponse.json({ error: `Failed to fetch RSS feed for ${finalCategory}` }, { status: 500 });
  }
}
