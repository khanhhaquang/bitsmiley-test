import { Suspense, useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { isAddressEqual } from 'viem'

import { useRegiter } from '@/hooks/useRegiter'
import { useUserInfo } from '@/hooks/useUserInfo'

import PersonalSignModal from './components/PersonalSignModal'

const BitUsd: React.FC = () => {
  const { enabledFeatures, isConnectedWithAA } = useUserInfo()
  const { airdropState } = useRegiter()
  const [airdropStateEqual, setAirdropStateEqual] = useState(false)
  console.log('---=airdropState--', airdropState)
  useEffect(() => {
    if (airdropState) {
      setAirdropStateEqual(
        isAddressEqual(
          airdropState,
          '0x0000000000000000000000000000000000000000'
        )
      )
    }
  }, [airdropState])

  if (!enabledFeatures?.AlphaNet)
    return (
      <div className="flex size-full items-center justify-center text-2xl text-error">
        Not available
      </div>
    )

  return (
    <Suspense fallback="...">
      <Outlet />
      {isConnectedWithAA && airdropStateEqual && <PersonalSignModal />}
    </Suspense>
  )
}

export default BitUsd
