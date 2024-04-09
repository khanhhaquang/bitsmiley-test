import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

import { useUserInfo } from '@/hooks/useUserInfo'

import TransferFromAA from './components/TransferFromAA'

const BitUsd: React.FC = () => {
  const { enabledFeatures, isConnectedWithAA } = useUserInfo()

  if (!enabledFeatures?.AlphaNet)
    return (
      <div className="flex size-full items-center justify-center text-2xl text-error">
        Not available
      </div>
    )

  return (
    <Suspense fallback="...">
      <Outlet />
      {isConnectedWithAA && <TransferFromAA />}
    </Suspense>
  )
}

export default BitUsd
