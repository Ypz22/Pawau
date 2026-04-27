export const siteConfig = {
  name: 'Pawau Boutique & Spa',
  defaultTitle: 'Pawau Boutique & Spa | Grooming y Spa para Mascotas en Ibarra',
  titleSuffix: ' | Pawau Boutique & Spa',
  description:
    'Pawau Boutique & Spa ofrece grooming, baño spa, corte de uñas y accesorios para mascotas en Ibarra. Reserva tu cita para consentir a tu perro o gato.',
  image: '/logoPawau.png',
  locale: 'es_EC',
  businessType: 'PetGrooming',
  phone: '+593999999999',
  address: {
    streetAddress: 'Ricardo Sánchez y Maldonado',
    addressLocality: 'Ibarra',
    addressRegion: 'Imbabura',
    addressCountry: 'EC',
  },
  social: {
    instagram: 'https://instagram.com/pawau_ec',
  },
};

export function getSiteUrl() {
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined') {
    return window.location.origin.replace(/\/+$/, '');
  }

  return 'https://pawau.vercel.app';
}

export function buildAbsoluteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalizedPath}`;
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'PetGrooming',
    name: siteConfig.name,
    image: buildAbsoluteUrl(siteConfig.image),
    url: getSiteUrl(),
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      ...siteConfig.address,
    },
    sameAs: [siteConfig.social.instagram],
  };
}

export function buildWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: getSiteUrl(),
    inLanguage: 'es',
  };
}
