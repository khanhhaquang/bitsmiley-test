import { MintPage } from './MintPage'
import { useState } from 'react'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { useCheckWalletConnection } from '@/hooks/useCheckWalletConnection'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserNfts } from '@/hooks/useUserNfts'
import { useAddressStatus } from '@/hooks/useAddressStatus'

const Main: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false)

  const { isLoading: isLoadingResources } = usePreloadResources()
  const { isLoading: isLoadingProjectInfo } = useProjectInfo()
  const { isLoading: isCheckingWallet } = useCheckWalletConnection()
  const { isLoading: isLoadingUserInfo } = useUserInfo()
  const { isLoading: isLoadingUserNfts } = useUserNfts()
  const { isLoading: isLoadingAddressStatus } = useAddressStatus()

  const isLoading =
    (isCheckingWallet ||
      isLoadingUserInfo ||
      isLoadingResources ||
      isLoadingUserNfts ||
      isLoadingAddressStatus ||
      isLoadingProjectInfo) &&
    !isEntered

  return (
    <div>
      {isLoading || !isEntered ? (
        <LoadingPage onEnter={() => setIsEntered(true)} isLoading={isLoading} />
      ) : (
        <MintPage />
      )}
    </div>
  )
}

export default Main
