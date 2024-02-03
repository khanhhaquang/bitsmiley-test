// import isMobile from 'ismobilejs'
import { MintPage } from './MintPage'
import { useState } from 'react'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { NetworkErrorPage } from '@/pages/Main/NetworkErrorPage'
import { useCheckWalletConnection } from '@/hooks/useCheckWalletConnection'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserNfts } from '@/hooks/useUserNfts'
import { useAddressStatus } from '@/hooks/useAddressStatus'
import { useSelector } from 'react-redux'
import { getNetworkError } from '@/store/common/reducer'
// import { MobilePage } from './MobilePage'

const Main: React.FC = () => {
  const isNetworkError = useSelector(getNetworkError)
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

  // if (isMobile(window.navigator).any) return <MobilePage />

  if (isNetworkError) return <NetworkErrorPage />

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
