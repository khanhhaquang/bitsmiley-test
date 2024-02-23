import { getStakingStatus } from '@/store/stakingStatus/reducer'
import { StakingStatus } from '@/types/status'
import { useSelector } from 'react-redux'
import { NotConnected } from './NotConnected'
import { StakingOnGoing } from './StakingOnGoing'
import { ConnectedNotStaked } from './ConnectedNotStaked'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useMemo } from 'react'
import { History } from './History'

type BoxContentProps = {
  isHistoryPage: boolean
  onBackClick: () => void
}

export const BoxContent: React.FC<BoxContentProps> = ({
  onBackClick,
  isHistoryPage
}) => {
  const { address } = useUserInfo()
  const stakingStatus = useSelector(getStakingStatus)

  const renderContent = useMemo(() => {
    if (address) {
      if (isHistoryPage) {
        return <History onBackClick={onBackClick} />
      }
      return <ConnectedNotStaked />
    }

    switch (stakingStatus) {
      case StakingStatus.NotConnected:
        return <NotConnected />
      case StakingStatus.ConnectedNotStaked:
        return <ConnectedNotStaked />
      case StakingStatus.StakingOnGoing:
        return <StakingOnGoing />
      default:
        return <NotConnected />
    }
  }, [address, isHistoryPage, onBackClick, stakingStatus])

  return (
    <div className="absolute left-1/2 top-[300px] z-10 -translate-x-1/2">
      <div className="relative">{renderContent}</div>
    </div>
  )
}
