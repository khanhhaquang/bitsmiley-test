import { useMemo } from 'react'

import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserStakes } from '@/hooks/useUserStakes'

import { ConnectedNotStaked } from './ConnectedNotStaked'
import { History } from './History'
import { MobileNotSupported } from './MobileNotSupported'
import { NotConnected } from './NotConnected'
import { OnChainLoading } from './OnchainLoading'
import { StakingFinished } from './StakingFinished'
import { StakingOnGoing } from './StakingOnGoing'

type BoxContentProps = {
  isHistoryPage: boolean
  onBackClick: () => void
}

export const BoxContent: React.FC<BoxContentProps> = ({
  onBackClick,
  isHistoryPage
}) => {
  const { isMobile } = useMediaQuery()
  const { address, isLoading: isConnecting } = useUserInfo()
  const { userStakes, isFetchingAll, isStakingEnded } = useUserStakes()

  const renderContent = useMemo(() => {
    if (isMobile) return <MobileNotSupported />
    if (isConnecting) return <OnChainLoading />

    if (address) {
      if (isFetchingAll) {
        return <OnChainLoading />
      }
      if (isHistoryPage) {
        return <History onBackClick={onBackClick} />
      }
      if (isStakingEnded) {
        return <StakingFinished />
      }
      if (userStakes?.length) {
        return <StakingOnGoing />
      }
      return <ConnectedNotStaked />
    }

    return <NotConnected />
  }, [
    isConnecting,
    address,
    isFetchingAll,
    isHistoryPage,
    isStakingEnded,
    userStakes?.length,
    onBackClick
  ])

  return (
    <div className="absolute left-1/2 top-[300px] z-10 -translate-x-1/2">
      <div className="relative">{renderContent}</div>
    </div>
  )
}
