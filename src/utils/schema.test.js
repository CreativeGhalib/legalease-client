import { describe, expect, it } from 'vitest'
import { buildLegalServiceSchema, buildOrganizationSchema, CATEGORY_SLUGS } from './schema'

const lawyer = {
  fullName: 'Adv. Rahim Ahmed',
  specialization: 'Criminal Law',
  location: 'Dhaka',
  consultationFeeMinor: 15000,
  bio: 'Bail and trial practice with 10 years of experience.',
}

describe('structured data builders', () => {
  it('LegalService schema exposes public fields only', () => {
    const schema = buildLegalServiceSchema(lawyer)
    expect(schema['@type']).toBe('LegalService')
    expect(schema.name).toBe('Adv. Rahim Ahmed')
    expect(schema.areaServed).toBe('Dhaka')
    expect(schema.priceRange).toBe('$150.00')
    expect(JSON.stringify(schema)).not.toMatch(/email|passwordHash|tokenVersion/i)
  })

  it('Organization schema describes LegalEase in Dhaka', () => {
    const schema = buildOrganizationSchema()
    expect(schema['@type']).toBe('Organization')
    expect(schema.name).toBe('LegalEase')
    expect(schema.address.addressLocality).toBe('Dhaka')
  })

  it('category slug map covers the eight canonical specializations', () => {
    expect(Object.keys(CATEGORY_SLUGS)).toHaveLength(8)
    expect(CATEGORY_SLUGS['criminal-lawyer']).toBe('Criminal Law')
  })
})
