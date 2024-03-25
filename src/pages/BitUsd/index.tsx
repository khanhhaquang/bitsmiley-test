import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { useUserInfo } from '@/hooks/useUserInfo'
import { FeatureEnabled } from '@/services/user'

const BitUsd: React.FC = () => {
  const { enabledFeatures } = useUserInfo()

  if (enabledFeatures?.AlphaNet === FeatureEnabled.DISABLED)
    return (
      <div className="flex size-full items-center justify-center text-2xl text-error">
        Not available
      </div>
    )

  return (
    <Suspense fallback="...">
      <Outlet />
    </Suspense>
  )
}

export default BitUsd
