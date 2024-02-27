import { useState } from 'react'
import isMobile from 'ismobilejs'
import { StakingPage } from './StakingPage'
import { LoadingPage } from '@/pages/Main/LoadingPage'
import { MobilePage } from './MobilePage'

const Main: React.FC = () => {
  const [isEntered, setIsEntered] = useState(false)

  if (isMobile(window.navigator).any) return <MobilePage />

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
