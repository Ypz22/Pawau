import { useEffect } from 'react';
import { buildAbsoluteUrl, siteConfig } from '../lib/seo';

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function upsertMeta(name: string, content: string, attribute: 'name' | 'property' = 'name') {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

function upsertJsonLd(schema: SeoProps['schema']) {
  const id = 'seo-structured-data';
  const existing = document.getElementById(id);

  if (!schema) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement('script');
  script.id = id;
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(schema);

  if (!existing) {
    document.head.appendChild(script);
  }
}

export default function Seo({
  title,
  description,
  path = '/',
  image = siteConfig.image,
  type = 'website',
  noIndex = false,
  schema,
}: SeoProps) {
  useEffect(() => {
    const absoluteUrl = buildAbsoluteUrl(path);
    const absoluteImage = image.startsWith('http') ? image : buildAbsoluteUrl(image);
    const robotsContent = noIndex ? 'noindex, nofollow' : 'index, follow';

    document.title = title;

    upsertMeta('description', description);
    upsertMeta('robots', robotsContent);
    upsertMeta('theme-color', '#FF5B1A');

    upsertMeta('og:type', type, 'property');
    upsertMeta('og:title', title, 'property');
    upsertMeta('og:description', description, 'property');
    upsertMeta('og:url', absoluteUrl, 'property');
    upsertMeta('og:image', absoluteImage, 'property');
    upsertMeta('og:site_name', siteConfig.name, 'property');
    upsertMeta('og:locale', siteConfig.locale, 'property');

    upsertMeta('twitter:card', 'summary_large_image');
    upsertMeta('twitter:title', title);
    upsertMeta('twitter:description', description);
    upsertMeta('twitter:image', absoluteImage);

    upsertLink('canonical', absoluteUrl);
    upsertJsonLd(schema);
  }, [description, image, noIndex, path, schema, title, type]);

  return null;
}
