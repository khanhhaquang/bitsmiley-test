import { MintPage } from './MintPage'
import { useState } from 'react'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { useCheckWalletConnection } from '@/hooks/useCheckWalletConnection'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserNfts } from '@/hooks/useUserNfts'

const Main: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false)

  const { isLoading: isLoadingUserInfo } = useUserInfo()
  const { isLoading: isLoadingProjectInfo } = useProjectInfo()
  const { isLoading: isLoadingResources } = usePreloadResources()
  const { isLoading: isCheckingWallet } = useCheckWalletConnection()
  const { isLoading: isLoadingUserNfts } = useUserNfts()

  const isLoading =
    (isCheckingWallet ||
      isLoadingUserInfo ||
      isLoadingResources ||
      isLoadingUserNfts ||
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
