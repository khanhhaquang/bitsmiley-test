import { Suspense } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { OnChainLoader } from '@/components/OnchainLoader'
import { useUserInfo } from '@/hooks/useUserInfo'
import { FeatureEnabled } from '@/services/user'

const BitUsd: React.FC = () => {
  const { isConnected, enabledFeatures, isLoading } = useUserInfo()
  const isBitUsdEnabled =
    !!enabledFeatures && enabledFeatures?.AlphaNet === FeatureEnabled.ENABLED

  if (
    (!isLoading && !isConnected) ||
    (!isLoading && isConnected && !isBitUsdEnabled)
  ) {
    return <Navigate to="/" replace />
  }

  return isLoading ? (
    <OnChainLoader />
  ) : (
    <Suspense fallback="...">
      <Outlet />
    </Suspense>
  )
}

export default BitUsd
