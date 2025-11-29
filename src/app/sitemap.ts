import { MetadataRoute } from 'next';

const siteUrl = 'https://pindrop-digipin.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();
  
  return [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add example DIGIPIN URLs for better indexing
    // These represent sample locations that can be discovered
    {
      url: `${siteUrl}/?pin=3PJ-7KL-4MN&mode=india`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
