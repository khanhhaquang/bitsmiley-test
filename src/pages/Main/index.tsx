import { useState } from 'react'
import isMobile from 'ismobilejs'
import { StakingPage } from './StakingPage'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { NetworkErrorPage } from '@/pages/Main/NetworkErrorPage'
import { useCheckWalletConnection } from '@/hooks/useCheckWalletConnection'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useUserNfts } from '@/hooks/useUserNfts'
import { useSelector } from 'react-redux'
import { getNetworkError } from '@/store/common/reducer'
import { MobilePage } from './MobilePage'

const Main: React.FC = () => {
  const isNetworkError = useSelector(getNetworkError)
  const [isEntered, setIsEntered] = useState(false)

  const { isLoading: isLoadingResources } = usePreloadResources()
  const { isLoading: isCheckingWallet } = useCheckWalletConnection()
  const { isLoading: isLoadingUserNfts } = useUserNfts()

  const isLoading =
    (isCheckingWallet || isLoadingResources || isLoadingUserNfts) && !isEntered

  if (isMobile(window.navigator).any) return <MobilePage />

  if (isNetworkError) return <NetworkErrorPage />

  return (
    <div>
      {isLoading || !isEntered ? (
        <LoadingPage onEnter={() => setIsEntered(true)} isLoading={isLoading} />
      ) : (
        <StakingPage />
      )}
    </div>
  )
}

export default Main
