import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'
import { FeatureEnabled } from '@/services/project'
import { useProjectInfo } from '@/hooks/useProjectInfo'

const Main = lazy(() => import('@/pages/Main'))
const MainBitUsd = lazy(() => import('@/pages/BitUsd'))

const MainBitPoint = lazy(() => import('@/pages/BitPoint'))
const BitPoint = lazy(() => import('@/pages/BitPoint/BitPoint'))
const BitPointHistory = lazy(() => import('@/pages/BitPoint/BitPointHistory'))

const BitUsd = lazy(() => import('@/pages/BitUsd/BitUsd'))
const OpenVault = lazy(() => import('@/pages/BitUsd/OpenVault'))
const MyVault = lazy(() => import('@/pages/BitUsd/MyVault'))

const Routes = () => {
  const { featuresEnabled } = useProjectInfo()
  const isAlphaNetEnabled = featuresEnabled?.AlphaNet === FeatureEnabled.ENABLED

  const basicRoutes: RouteObject[] = [
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

  const alphaNetRoutes: RouteObject[] = !isAlphaNetEnabled
    ? []
    : [
        {
          path: 'bit-usd',
          id: 'bitUsd',
          element: <MainBitUsd />,
          children: [
            {
              index: true,
              element: <BitUsd />
            },
            {
              path: 'vault/:chainId',
              element: <OpenVault />
            },
            {
              path: 'my-vault/:chainId',
              element: <MyVault />
            }
          ]
        },
        {
          path: 'bit-point',
          id: 'bitPoint',
          element: <MainBitPoint />,
          children: [
            {
              index: true,
              element: <BitPoint />
            },
            {
              path: 'history',
              element: <BitPointHistory />
            }
          ]
        }
      ]

  return useRoutes([...basicRoutes, ...alphaNetRoutes])
}

export default Routes
