import { MintPage } from './MintPage'
import { useState } from 'react'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { useCheckWalletConnection } from '@/hooks/useCheckWalletConnection'
import { usePreloadResources } from '@/hooks/usePreloadResources'

const Main: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false)

  const { isLoading: isLoadingResources } = usePreloadResources()
  const { isLoading: isCheckingWallet } = useCheckWalletConnection()

  const isLoading = isCheckingWallet || isLoadingResources

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
