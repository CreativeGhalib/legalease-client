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

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
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
