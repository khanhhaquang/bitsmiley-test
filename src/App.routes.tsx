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

const Airdrop = lazy(() => import('@/pages/Airdrop'))
const AirdropSelectStage = lazy(() => import('@/pages/Airdrop/SelectStage'))
const AirdropArcade = lazy(() => import('@/pages/Airdrop/Arcade'))
const AirdropPreStake = lazy(() => import('@/pages/Airdrop/PreSeasonStake'))

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
          element: <Navigate to="./alphanet" />
        },
        {
          path: 'alphanet',
          id: 'alphanet',
          element: <MainBitUsd />,
          children: [
            {
              index: true,
              element: <BitUsd />
            },
            {
              path: 'vault/:chainId/:collateralId',
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
      path: 'airdrop',
      id: 'airdrop',
      element: <Airdrop />,
      children: [
        {
          index: true,
          element: <AirdropSelectStage />
        },
        {
          path: 'pre-stake',
          element: <AirdropPreStake />
        },
        {
          path: 'arcade',
          element: <AirdropArcade />
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
