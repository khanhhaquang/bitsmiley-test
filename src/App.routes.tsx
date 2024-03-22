import { lazy } from 'react'
import { Navigate, RouteObject, useRoutes } from 'react-router-dom'

import MainBitPoint from './pages/BitPoint'
import BitPoint from './pages/BitPoint/BitPoint'
import BitPointHistory from './pages/BitPoint/BitPointHistory'

const Main = lazy(() => import('@/pages/Main'))

const BitUsd = lazy(() => import('@/pages/BitUsd'))
const BitUsdVault = lazy(() => import('@/pages/BitUsd/Vault'))
const BitUsdMintingPairs = lazy(() => import('@/pages/BitUsd/MintingPairs'))

const Routes = () => {
  const routes: RouteObject[] = [
    {
      path: '/',
      id: 'main',
      element: <Main />
    },
    {
      path: 'bit-usd',
      id: 'bitUSD',
      element: <BitUsd />,
      children: [
        {
          index: true,
          element: <BitUsdMintingPairs />
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
