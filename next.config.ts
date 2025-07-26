
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'static.toiimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'timesofindia.indiatimes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.hindustantimes.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'c.ndtvimg.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.assettype.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'feeds.abplive.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'bengali.abplive.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'live.staticflickr.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '1.img-dpreview.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '1.img-dpreview.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'news.bbcimg.co.uk',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.reuters.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'apod.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.mos.cms.futurecdn.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.esa.int',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'earthobservatory.nasa.gov',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.nature.org',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
