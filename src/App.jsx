import { RouterProvider } from 'react-router-dom'
import { router } from './routes/router'

// Theme (light/dark) is applied before first paint by the blocking inline
// script in index.html, and kept in sync afterward by the useTheme hook
// used in PublicLayout/DashboardLayout. No initialization is needed here.
export default function App() {
  return <RouterProvider router={router} />
}
