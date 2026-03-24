import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tbesglobal.com';

  // Basic routes
  const routes = [
    '',
    '/about',
    '/services',
    '/projects',
    '/career',
    '/contact',
    '/learning',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
