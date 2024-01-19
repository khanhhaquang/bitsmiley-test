import { MintPage } from './MintPage'
import { useState } from 'react'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { useCheckWalletConnection } from '@/hooks/useCheckWalletConnection'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useAddressStatus } from '@/hooks/useAddressStatus'
import { useProjectInfo } from '@/hooks/useProjectInfo'
import { useUserInfo } from '@/hooks/useUserInfo'

const Main: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false)

  const { isLoading: isLoadingUserInfo } = useUserInfo()
  const { isLoading: isLoadingProjectInfo } = useProjectInfo()
  const { isLoading: isLoadingResources } = usePreloadResources()
  const { isLoading: isCheckingWallet } = useCheckWalletConnection()
  const { isLoading: isLoadingAccountStatus } = useAddressStatus()

  const isLoading =
    (isCheckingWallet ||
      isLoadingUserInfo ||
      isLoadingResources ||
      isLoadingAccountStatus ||
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
