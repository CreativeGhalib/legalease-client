import { createBrowserRouter, Navigate } from 'react-router-dom'
import GuestOnlyRoute from '../auth/GuestOnlyRoute'
import ProtectedRoute from '../auth/ProtectedRoute'
import RoleRoute from '../auth/RoleRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import PublicLayout from '../layouts/PublicLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardOverviewPage from '../pages/dashboard/DashboardOverviewPage'
import FutureDashboardPage from '../pages/dashboard/FutureDashboardPage'
import UpdateAccountProfilePage from '../pages/dashboard/UpdateAccountProfilePage'
import UserHiringHistoryPage from '../pages/dashboard/UserHiringHistoryPage'
import LawyerHiringHistoryPage from '../pages/dashboard/LawyerHiringHistoryPage'
import TransactionHistoryPage from '../pages/dashboard/TransactionHistoryPage'
import ManageLegalProfilePage from '../pages/dashboard/ManageLegalProfilePage'
import NotFoundPage from '../pages/errors/NotFoundPage'
import UnauthorizedPage from '../pages/errors/UnauthorizedPage'
import HomePage from '../pages/public/HomePage'
import BrowseLawyersPage from '../pages/public/BrowseLawyersPage'
import LawyerDetailsPage from '../pages/public/LawyerDetailsPage'
import InfoPage from '../pages/public/InfoPage'
import PaymentReturnPage from '../pages/public/PaymentReturnPage'
import UserCommentsPage from '../pages/dashboard/UserCommentsPage'
import {
  DeferredAdminAnalyticsPage,
  DeferredAdminLawyersPage,
  DeferredAdminTransactionsPage,
  DeferredAdminUsersPage,
} from './DeferredAdminPages'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      // ── Public pages ────────────────────────────────────────────────────────
      { index: true, element: <HomePage /> },
      { path: '/lawyers', element: <BrowseLawyersPage /> },
      { path: '/lawyers/:lawyerId', element: <LawyerDetailsPage /> },
      {
        path: '/about',
        element: (
          <InfoPage eyebrow="ABOUT LEGALEASE" title="A more understandable path to legal help">
            <p>
              LegalEase helps people discover legal professionals through clear, comparable public
              practice information.
            </p>
          </InfoPage>
        ),
      },
      {
        path: '/contact',
        element: (
          <InfoPage eyebrow="CONTACT" title="Get in touch">
            <p>
              Contact details and support workflows will be added as LegalEase grows. In the
              meantime, browse the directory to explore published lawyer profiles.
            </p>
          </InfoPage>
        ),
      },
      {
        path: '/privacy',
        element: (
          <InfoPage eyebrow="PRIVACY" title="Privacy matters">
            <p>
              LegalEase is designed to limit public data to professional profile information.
              Authentication and payment data are handled through protected server-side workflows.
            </p>
          </InfoPage>
        ),
      },

      // ── Authentication (guest-only) ──────────────────────────────────────────
      {
        path: '/login',
        element: (
          <GuestOnlyRoute>
            <LoginPage />
          </GuestOnlyRoute>
        ),
      },
      {
        path: '/register',
        element: (
          <GuestOnlyRoute>
            <RegisterPage />
          </GuestOnlyRoute>
        ),
      },

      // ── Payment return pages ─────────────────────────────────────────────────
      {
        path: '/payment/success',
        element: (
          <ProtectedRoute>
            <PaymentReturnPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/payment/cancel',
        element: (
          <ProtectedRoute>
            <PaymentReturnPage cancelled />
          </ProtectedRoute>
        ),
      },

      // ── Protected dashboard ──────────────────────────────────────────────────
      {
        path: '/dashboard',
        element: (
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        ),
        children: [
          // Dashboard index — shown for all roles
          { index: true, element: <DashboardOverviewPage /> },

          // User routes — /dashboard/user redirects to overview (Phase 6 complete)
          {
            path: 'user',
            element: (
              <RoleRoute roles={['user']}>
                <Navigate to="/dashboard" replace />
              </RoleRoute>
            ),
          },
          {
            path: 'user/hiring-history',
            element: (
              <RoleRoute roles={['user']}>
                <UserHiringHistoryPage />
              </RoleRoute>
            ),
          },
          {
            path: 'user/update-profile',
            element: (
              <RoleRoute roles={['user']}>
                <UpdateAccountProfilePage />
              </RoleRoute>
            ),
          },
          {
            path: 'user/comments',
            element: (
              <RoleRoute roles={['user']}>
                <UserCommentsPage />
              </RoleRoute>
            ),
          },
          {
            path: 'user/transactions',
            element: (
              <RoleRoute roles={['user']}>
                <TransactionHistoryPage />
              </RoleRoute>
            ),
          },

          // Lawyer routes — /dashboard/lawyer redirects to overview (Phase 6 complete)
          {
            path: 'lawyer',
            element: (
              <RoleRoute roles={['lawyer']}>
                <Navigate to="/dashboard" replace />
              </RoleRoute>
            ),
          },
          {
            path: 'lawyer/hiring-history',
            element: (
              <RoleRoute roles={['lawyer']}>
                <LawyerHiringHistoryPage />
              </RoleRoute>
            ),
          },
          {
            path: 'lawyer/manage-legal-profile',
            element: (
              <RoleRoute roles={['lawyer']}>
                <ManageLegalProfilePage />
              </RoleRoute>
            ),
          },
          {
            path: 'lawyer/transactions',
            element: (
              <RoleRoute roles={['lawyer']}>
                <TransactionHistoryPage />
              </RoleRoute>
            ),
          },

          // Admin routes — index shows placeholder (future analytics/overview)
          {
            path: 'admin',
            element: (
              <RoleRoute roles={['admin']}>
                <FutureDashboardPage title="Admin overview" phase="a future phase" />
              </RoleRoute>
            ),
          },
          {
            path: 'admin/manage-users',
            element: (
              <RoleRoute roles={['admin']}>
                <DeferredAdminUsersPage />
              </RoleRoute>
            ),
          },
          {
            path: 'admin/manage-lawyers',
            element: (
              <RoleRoute roles={['admin']}>
                <DeferredAdminLawyersPage />
              </RoleRoute>
            ),
          },
          {
            path: 'admin/all-transactions',
            element: (
              <RoleRoute roles={['admin']}>
                <DeferredAdminTransactionsPage />
              </RoleRoute>
            ),
          },
          {
            path: 'admin/analytics',
            element: (
              <RoleRoute roles={['admin']}>
                <DeferredAdminAnalyticsPage />
              </RoleRoute>
            ),
          },
        ],
      },

      // ── Error pages ──────────────────────────────────────────────────────────
      { path: '/unauthorized', element: <UnauthorizedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
