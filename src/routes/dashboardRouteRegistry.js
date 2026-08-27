export const dashboardRouteRegistry = {
  user: [
    { label: 'Dashboard overview', to: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'My hiring requests', to: '/dashboard/user/hiring-history', icon: 'FileText', phase: 'Phase 7' },
    { label: 'Update profile', to: '/dashboard/user/update-profile', icon: 'UserPen' },
    { label: 'Comments', to: '/dashboard/user/comments', icon: 'MessageSquare', phase: 'Phase 9' },
    { label: 'Transactions', to: '/dashboard/user/transactions', icon: 'CreditCard', phase: 'Phase 8' },
    { label: 'Phone verification', to: '/dashboard/phone-verification', icon: 'KeyRound' },
  ],
  lawyer: [
    { label: 'Dashboard overview', to: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Client requests', to: '/dashboard/lawyer/hiring-history', icon: 'Inbox', phase: 'Phase 7' },
    { label: 'Manage legal profile', to: '/dashboard/lawyer/manage-legal-profile', icon: 'Briefcase' },
    { label: 'Transactions', to: '/dashboard/lawyer/transactions', icon: 'CreditCard', phase: 'Phase 8' },
    { label: 'Phone verification', to: '/dashboard/phone-verification', icon: 'KeyRound' },
  ],
  admin: [
    { label: 'Dashboard overview', to: '/dashboard', icon: 'LayoutDashboard' },
    { label: 'Manage users', to: '/dashboard/admin/manage-users', icon: 'Users', phase: 'Phase 10' },
    { label: 'Manage lawyers', to: '/dashboard/admin/manage-lawyers', icon: 'Scale', phase: 'Phase 10' },
    { label: 'All transactions', to: '/dashboard/admin/all-transactions', icon: 'Receipt', phase: 'Phase 10' },
    { label: 'Analytics', to: '/dashboard/admin/analytics', icon: 'BarChart3', phase: 'Phase 10' },
    { label: 'Leads', to: '/dashboard/admin/leads', icon: 'Users' },
  ],
}
