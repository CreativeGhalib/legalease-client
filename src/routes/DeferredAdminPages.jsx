import { lazy, Suspense } from 'react'
import AuthCheckingScreen from '../components/common/AuthCheckingScreen'

const AdminUsersPage = lazy(() => import('../pages/dashboard/AdminPages').then((module) => ({ default: module.AdminUsersPage })))
const AdminLawyersPage = lazy(() => import('../pages/dashboard/AdminPages').then((module) => ({ default: module.AdminLawyersPage })))
const AdminTransactionsPage = lazy(() => import('../pages/dashboard/AdminPages').then((module) => ({ default: module.AdminTransactionsPage })))
const AdminAnalyticsPage = lazy(() => import('../pages/dashboard/AdminPages').then((module) => ({ default: module.AdminAnalyticsPage })))

function DeferredPage({ children }) {
  return <Suspense fallback={<AuthCheckingScreen />}>{children}</Suspense>
}

export function DeferredAdminUsersPage() {
  return <DeferredPage><AdminUsersPage /></DeferredPage>
}

export function DeferredAdminLawyersPage() {
  return <DeferredPage><AdminLawyersPage /></DeferredPage>
}

export function DeferredAdminTransactionsPage() {
  return <DeferredPage><AdminTransactionsPage /></DeferredPage>
}

export function DeferredAdminAnalyticsPage() {
  return <DeferredPage><AdminAnalyticsPage /></DeferredPage>
}
