import { Suspense, useMemo } from 'react'
import { Outlet } from 'react-router-dom'
import { isAddressEqual } from 'viem'

import { useRegister } from '@/hooks/useRegister'
import { useUserInfo } from '@/hooks/useUserInfo'

import PersonalSignModal from './components/PersonalSignModal'

const BitUsd: React.FC = () => {
  const { enabledFeatures, isConnectedWithAA } = useUserInfo()
  const { airdropState } = useRegister()

  const airdropStateEqual = useMemo(() => {
    if (airdropState)
      return isAddressEqual(
        airdropState,
        '0x0000000000000000000000000000000000000000'
      )

    return false
  }, [airdropState])

  if (!enabledFeatures?.AlphaNet)
    return (
      <div className="flex size-full items-center justify-center text-2xl text-error">
        Not available
      </div>
    )

  if (isConnectedWithAA && !airdropState) return null

  return (
    <Suspense fallback="...">
      <Outlet />
      {isConnectedWithAA && airdropStateEqual && <PersonalSignModal />}
    </Suspense>
  )
}

export default BitUsd
