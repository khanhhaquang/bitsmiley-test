import { useState } from 'react'
import isMobile from 'ismobilejs'
import { StakingPage } from './StakingPage'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { NetworkErrorPage } from '@/pages/Main/NetworkErrorPage'
import { useSelector } from 'react-redux'
import { getNetworkError } from '@/store/common/reducer'
import { MobilePage } from './MobilePage'

const Main: React.FC = () => {
  const isNetworkError = useSelector(getNetworkError)
  const [isEntered, setIsEntered] = useState(false)

  if (isMobile(window.navigator).any) return <MobilePage />

  if (isNetworkError) return <NetworkErrorPage />

  return (
    <div>
      {!isEntered ? (
        <LoadingPage onEnter={() => setIsEntered(true)} isLoading={false} />
      ) : (
        <StakingPage />
      )}
    </div>
  )
}

export default Main
