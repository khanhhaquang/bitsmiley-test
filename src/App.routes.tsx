import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

const Main = lazy(() => import('@/pages/Main'))
const MainApp = lazy(() => import('@/pages/MainApp'))

const MainBitUsd = lazy(() => import('@/pages/BitUsd'))
const BitUsdVault = lazy(() => import('@/pages/BitUsd/Vault'))
const BitUsd = lazy(() => import('@/pages/BitUsd/MintingPairs'))

const MainBitPoint = lazy(() => import('@/pages/BitPoint'))
const BitPoint = lazy(() => import('@/pages/BitPoint/BitPoint'))
const BitPointHistory = lazy(() => import('@/pages/BitPoint/BitPointHistory'))

const Routes = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      id: 'main',
      element: <Main />
    },
    {
      path: 'app',
      id: 'app',
      element: <MainApp />,
      children: [
        {
          index: true,
          element: <Navigate to="./testnet" />
        },
        {
          path: 'testnet',
          id: 'testNet',
          element: <MainBitUsd />,
          children: [
            {
              index: true,
              element: <BitUsd />
            },
            {
              path: 'vault/:chainId',
              element: <BitUsdVault />
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
    },
    {
      path: '*',
      id: 'default',
      element: <Navigate to="/" replace />
    }
  ]

  return useRoutes(routes)
}

export default Routes
