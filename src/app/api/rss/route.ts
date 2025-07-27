
import { NextResponse, NextRequest } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

const rssFeeds: { [key: string]: { [category: string]: string | string[] } } = {
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
    en: {
      'ALL': [
        'https://www.flickr.com/services/feeds/photos_public.gne?tags=nature&format=rss_200',
        'https://feeds.bbci.co.uk/news/in_pictures/rss.xml',
        'https://www.reutersagency.com/feed/?best-topics=pictures&post_type=best',
        'https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss',
        'https://apod.nasa.gov/apod.rss',
        'https://www.space.com/feeds/all',
        'https://hubblesite.org/api/v3/rss/news_release_image',
        'https://www.esa.int/rssfeed/Our_Activities/Space_Science',
        'https://earthobservatory.nasa.gov/feeds/rss',
        'https://blog.nature.org/science/feed/',
        'https://www.behance.net/galleries/featured?content=projects&format=rss',
        'https://rss.app/feeds/pB44nwiUuEkixuSz.xml',
        'https://www.designboom.com/feed/',
        'https://www.itsnicethat.com/feed',
        'https://500px.com/editors.rss',
        'https://www.flickr.com/explore/interesting/7days/rss',
        'https://petapixel.com/feed/',
        'https://www.thisiscolossal.com/feed/',
        'https://abduzeedo.com/rss.xml',
        'https://www.magnumphotos.com/feed/',
        'https://www.iso1200.com/feeds/posts/default',
        'https://www.featureshoot.com/feed/',
        'https://streetphotographymagazine.com/feed/',
      ]
    },
    bn: {
      'ALL': [
        'https://www.flickr.com/services/feeds/photos_public.gne?tags=nature&format=rss_200',
        'https://feeds.bbci.co.uk/news/in_pictures/rss.xml',
        'https://www.reutersagency.com/feed/?best-topics=pictures&post_type=best',
        'https://www.nasa.gov/rss/dyn/lg_image_of_the_day.rss',
        'https://apod.nasa.gov/apod.rss',
        'https://www.space.com/feeds/all',
        'https://hubblesite.org/api/v3/rss/news_release_image',
        'https://www.esa.int/rssfeed/Our_Activities/Space_Science',
        'https://earthobservatory.nasa.gov/feeds/rss',
        'https://blog.nature.org/science/feed/',
        'https://www.behance.net/galleries/featured?content=projects&format=rss',
        'https://rss.app/feeds/pB44nwiUuEkixuSz.xml',
        'https://www.designboom.com/feed/',
        'https://www.itsnicethat.com/feed',
        'https://500px.com/editors.rss',
        'https://www.flickr.com/explore/interesting/7days/rss',
        'https://petapixel.com/feed/',
        'https://www.thisiscolossal.com/feed/',
        'https://abduzeedo.com/rss.xml',
        'https://www.magnumphotos.com/feed/',
        'https://www.iso1200.com/feeds/posts/default',
        'https://www.featureshoot.com/feed/',
        'https://streetphotographymagazine.com/feed/',
      ]
    }
  },
  journals: {
    en: {
        'ALL': [
            'https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=science',
            'https://www.pnas.org/rss/current.xml',
            'https://www.nature.com/nphys.rss',
            'https://journals.aps.org/prl/rss/current.xml',
            'https://ieeexplore.ieee.org/rss/TOC85.XML',
            'https://epjquantumtechnology.springeropen.com/articles/rss.xml',
            'https://www.sciencedirect.com/journal/physics-reports/rss',
            'https://www.nature.com/nature.rss',
            'https://link.springer.com/search.rss?facet-journal-id=146',
            'http://feeds.plos.org/plosone/LatestArticles',
            'http://export.arxiv.org/rss/physics',
            'http://export.arxiv.org/rss/cs.AI',
            'https://dl.acm.org/action/showFeed?type=etoc&feed=rss&jc=TOG',
            'https://www.edutopia.org/rss.xml',
            'https://www.sciencedaily.com/rss/',
        ]
    },
    bn: {
        'ALL': [
            'https://www.science.org/action/showFeed?type=etoc&feed=rss&jc=science',
            'https://www.pnas.org/rss/current.xml',
            'https://www.nature.com/nphys.rss',
            'https://journals.aps.org/prl/rss/current.xml',
            'https://ieeexplore.ieee.org/rss/TOC85.XML',
            'https://epjquantumtechnology.springeropen.com/articles/rss.xml',
            'https://www.sciencedirect.com/journal/physics-reports/rss',
            'https://www.nature.com/nature.rss',
            'https://link.springer.com/search.rss?facet-journal-id=146',
            'http://feeds.plos.org/plosone/LatestArticles',
            'http://export.arxiv.org/rss/physics',
            'http://export.arxiv.org/rss/cs.AI',
            'https://dl.acm.org/action/showFeed?type=etoc&feed=rss&jc=TOG',
            'https://www.edutopia.org/rss.xml',
            'https://www.sciencedaily.com/rss/',
        ]
    }
  }
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const section = searchParams.get('section') || 'news';
  const lang = searchParams.get('lang') || 'en';
  const category = searchParams.get('category');

  let feedsForSection = rssFeeds[section as keyof typeof rssFeeds]?.[lang as 'en' | 'bn'];

  if (!feedsForSection) {
    return NextResponse.json({ error: 'Invalid section or language' }, { status: 400 });
  }
  
  const defaultCategory = Object.keys(feedsForSection)[0];
  const finalCategory = category || defaultCategory;
  const feedUrls = feedsForSection[finalCategory];
  
  if (!feedUrls) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }

  try {
    const allItems: (Parser.Item & { category: string; source: string; })[] = [];

    const fetchPromises = (Array.isArray(feedUrls) ? feedUrls : [feedUrls]).map(async (feedUrl) => {
        try {
            const feed = await parser.parseURL(feedUrl);
            const itemsWithCategory = feed.items.map(item => ({
              ...item,
              category: finalCategory,
              source: feed.title || '',
            }));
            allItems.push(...itemsWithCategory);
        } catch (error) {
            console.error(`Failed to fetch RSS feed from ${feedUrl}:`, error);
        }
    });

    await Promise.all(fetchPromises);
    
    // Sort all items by date
    allItems.sort((a, b) => {
        const dateA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
        const dateB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
        return dateB - dateA;
    });

    return NextResponse.json(allItems);
  } catch (error) {
    console.error(`Failed to fetch RSS feed for ${finalCategory} (${section}/${lang}):`, error);
    return NextResponse.json({ error: `Failed to fetch RSS feed for ${finalCategory}` }, { status: 500 });
  }
}
