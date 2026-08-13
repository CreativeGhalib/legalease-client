export const dashboardRouteRegistry = {
  user: [
    { label: 'Dashboard overview', to: '/dashboard' },
    { label: 'Hiring history', to: '/dashboard/user/hiring-history', phase: 'Phase 7' },
    { label: 'Update profile', to: '/dashboard/user/update-profile' },
    { label: 'Comments', to: '/dashboard/user/comments', phase: 'Phase 9' },
    { label: 'Transactions', to: '/dashboard/user/transactions', phase: 'Phase 8' },
  ],
  lawyer: [
    { label: 'Dashboard overview', to: '/dashboard' },
    { label: 'Hiring history', to: '/dashboard/lawyer/hiring-history', phase: 'Phase 7' },
    { label: 'Manage legal profile', to: '/dashboard/lawyer/manage-legal-profile' },
    { label: 'Transactions', to: '/dashboard/lawyer/transactions', phase: 'Phase 8' },
  ],
  admin: [
    { label: 'Dashboard overview', to: '/dashboard' },
    { label: 'Manage users', to: '/dashboard/admin/manage-users', phase: 'Phase 10' },
    { label: 'Manage lawyers', to: '/dashboard/admin/manage-lawyers', phase: 'Phase 10' },
    { label: 'All transactions', to: '/dashboard/admin/all-transactions', phase: 'Phase 10' },
    { label: 'Analytics', to: '/dashboard/admin/analytics', phase: 'Phase 10' },
  ],
}
