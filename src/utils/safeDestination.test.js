import { describe, expect, it } from 'vitest'
import { safeDestination } from './safeDestination'

describe('safeDestination', () => {
  it('keeps only safe internal paths', () => {
    expect(safeDestination({ pathname: '/dashboard/user/comments', search: '?x=1' })).toBe('/dashboard/user/comments?x=1')
    expect(safeDestination({ pathname: '//evil.example' })).toBe('/dashboard')
    expect(safeDestination({ pathname: 'https://evil.example' })).toBe('/dashboard')
    expect(safeDestination({ pathname: '/\\evil.example' })).toBe('/dashboard')
  })
})
