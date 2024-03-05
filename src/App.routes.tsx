import { lazy } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { FeatureEnabled } from '@/services/project'
import { useProjectInfo } from '@/hooks/useProjectInfo'

const Main = lazy(() => import('@/pages/Main'))
const MainNet = lazy(() => import('@/pages/MainNet'))
const OpenVault = lazy(() => import('@/pages/OpenVault'))
const MyVault = lazy(() => import('@/pages/MyVault'))

const Routes = () => {
  const { featuresEnabled } = useProjectInfo()
  const isAlphaNetEnabled = featuresEnabled?.AlphaNet === FeatureEnabled.ENABLED

  const basicRoutes = [
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
  ]

  const alphaNetRoutes = [
    {
      path: '/bit-usd',
      id: 'bitUsd',
      element: <MainNet />
    },
    {
      path: '/open-vault',
      id: 'openVault',
      element: <OpenVault />
    },
    {
      path: '/my-vault',
      id: 'myVault',
      element: <MyVault />
    }
  ]

  return useRoutes(basicRoutes.concat(isAlphaNetEnabled ? alphaNetRoutes : []))
}

export default Routes
