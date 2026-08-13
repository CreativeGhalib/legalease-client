import { createBrowserRouter } from 'react-router-dom'
import GuestOnlyRoute from '../auth/GuestOnlyRoute'
import ProtectedRoute from '../auth/ProtectedRoute'
import RoleRoute from '../auth/RoleRoute'
import DashboardStubLayout from '../layouts/DashboardStubLayout'
import PublicLayout from '../layouts/PublicLayout'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import DashboardHomePage from '../pages/dashboard/DashboardHomePage'
import RoleStubPage from '../pages/dashboard/RoleStubPage'
import ManageLegalProfilePage from '../pages/dashboard/ManageLegalProfilePage'
import NotFoundPage from '../pages/errors/NotFoundPage'
import UnauthorizedPage from '../pages/errors/UnauthorizedPage'
import HomePage from '../pages/public/HomePage'
import BrowseLawyersPage from '../pages/public/BrowseLawyersPage'
import LawyerDetailsPage from '../pages/public/LawyerDetailsPage'
import InfoPage from '../pages/public/InfoPage'

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '/lawyers', element: <BrowseLawyersPage /> },
      { path: '/lawyers/:lawyerId', element: <LawyerDetailsPage /> },
      { path: '/about', element: <InfoPage eyebrow="ABOUT LEGALEASE" title="A more understandable path to legal help"><p>LegalEase helps people discover legal professionals through clear, comparable public practice information.</p></InfoPage> },
      { path: '/contact', element: <InfoPage eyebrow="CONTACT" title="Get in touch"><p>Contact details and support workflows will be added as LegalEase grows. In the meantime, browse the directory to explore published lawyer profiles.</p></InfoPage> },
      { path: '/privacy', element: <InfoPage eyebrow="PRIVACY" title="Privacy matters"><p>LegalEase is designed to limit public data to professional profile information. Authentication and payment data are handled through protected server-side workflows.</p></InfoPage> },
      { path: '/login', element: <GuestOnlyRoute><LoginPage /></GuestOnlyRoute> },
      { path: '/register', element: <GuestOnlyRoute><RegisterPage /></GuestOnlyRoute> },
      {
        path: '/dashboard',
        element: <ProtectedRoute><DashboardStubLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardHomePage /> },
          { path: 'user', element: <RoleRoute roles={['user']}><RoleStubPage role="User" /></RoleRoute> },
          { path: 'lawyer', element: <RoleRoute roles={['lawyer']}><RoleStubPage role="Lawyer" /></RoleRoute> },
          { path: 'lawyer/manage-legal-profile', element: <RoleRoute roles={['lawyer']}><ManageLegalProfilePage /></RoleRoute> },
          { path: 'admin', element: <RoleRoute roles={['admin']}><RoleStubPage role="Admin" /></RoleRoute> },
        ],
      },
      { path: '/unauthorized', element: <UnauthorizedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
