import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'

const Main = lazy(() => import('@/pages/Main'))
const MainNet = lazy(() => import('@/pages/MainNet'))
const OpenVault = lazy(() => import('@/pages/OpenVault'))
const MyVault = lazy(() => import('@/pages/MyVault'))

const Routes = () => {
  return useRoutes([
    {
      path: '/',
      id: 'main',
      element: <Main />
    },
    {
      path: '/mainNet',
      id: 'mainNet',
      element: <MainNet />
    },
    {
      path: '/openVault',
      id: 'openVault',
      element: <OpenVault />
    },
    {
      path: '/myVault',
      id: 'myVault',
      element: <MyVault />
    },
    {
      path: '*',
      id: 'default',
      element: <Navigate to="/" replace />
    }
  ])
}

export default Routes
