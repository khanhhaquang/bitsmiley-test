import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

const Main = lazy(() => import('@/pages/Main'))

const Routes = () => {
  return useRoutes([
    {
      path: '/',
      id: 'main',
      element: <Main />
    },
    {
      path: '*',
      id: 'default',
      element: <Navigate to="/" replace />
    }
  ])
}

export default Routes
