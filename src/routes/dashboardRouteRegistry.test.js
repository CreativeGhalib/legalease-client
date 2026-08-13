import { describe, expect, it } from 'vitest'
import { dashboardRouteRegistry } from './dashboardRouteRegistry'

describe('Phase 6 dashboard route registry', () => {
  it('exposes only the frozen role-specific navigation paths', () => {
    expect(dashboardRouteRegistry.user.map((item) => item.to)).toEqual([
      '/dashboard', '/dashboard/user/hiring-history', '/dashboard/user/update-profile', '/dashboard/user/comments', '/dashboard/user/transactions',
    ])
    expect(dashboardRouteRegistry.lawyer.map((item) => item.to)).toEqual([
      '/dashboard', '/dashboard/lawyer/hiring-history', '/dashboard/lawyer/manage-legal-profile', '/dashboard/lawyer/transactions',
    ])
    expect(dashboardRouteRegistry.admin.map((item) => item.to)).toEqual([
      '/dashboard', '/dashboard/admin/manage-users', '/dashboard/admin/manage-lawyers', '/dashboard/admin/all-transactions', '/dashboard/admin/analytics',
    ])
  })
})
