import { MintPage } from './MintPage'
import { useState } from 'react'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { useCheckWalletConnection } from '@/hooks/useCheckWalletConnection'
import { usePreloadResources } from '@/hooks/usePreloadResources'
import { useInscriptionStatus } from '@/hooks/useInscriptionStatus'
import { useProjectInfo } from '@/hooks/useProjectInfo'

const Main: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false)

  const { isLoading: isLoadingProjectInfo } = useProjectInfo()
  const { isLoading: isLoadingResources } = usePreloadResources()
  const { isLoading: isCheckingWallet } = useCheckWalletConnection()
  const { isLoading: isLoadingInscriptionStatus } = useInscriptionStatus()

  const isLoading =
    (isCheckingWallet ||
      isLoadingResources ||
      isLoadingInscriptionStatus ||
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
