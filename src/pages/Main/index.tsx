import isMobile from 'ismobilejs'
import { StakingPage } from './StakingPage'
import { MobilePage } from './MobilePage'

const Main: React.FC = () => {
  if (isMobile(window.navigator).any) return <MobilePage />

  return <StakingPage />
}

export default Main
