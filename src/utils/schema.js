export function buildLegalServiceSchema(lawyer) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: lawyer.fullName,
    areaServed: lawyer.location || 'Bangladesh',
    serviceType: lawyer.specialization,
    priceRange: `$${((lawyer.consultationFeeMinor ?? 0) / 100).toFixed(2)}`,
    description: (lawyer.bio || '').slice(0, 300),
  }
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LegalEase',
    description: 'Marketplace connecting clients with verified independent lawyers in Bangladesh.',
    address: { '@type': 'PostalAddress', addressLocality: 'Dhaka', addressCountry: 'BD' },
  }
}

export const CATEGORY_SLUGS = {
  'family-lawyer': 'Family Law',
  'criminal-lawyer': 'Criminal Law',
  'corporate-lawyer': 'Corporate Law',
  'property-lawyer': 'Property Law',
  'immigration-lawyer': 'Immigration Law',
  'employment-lawyer': 'Employment Law',
  'civil-lawyer': 'Civil Litigation',
  'ip-lawyer': 'Intellectual Property',
}
