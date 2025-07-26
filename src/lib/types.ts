export type Article = {
  id: string;
  slug: string;
  title: string;
  author: string;
  source: string;
  publishedAt: string;
  category: string;
  imageUrl: string;
  imageHint: string;
  content: string;
  summary: string;
  sentiment: 'Positive' | 'Negative';
  link: string;
};

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
};
