import { getStakingStatus } from '@/store/stakingStatus/reducer'
import { StakingStatus } from '@/types/status'
import { useSelector } from 'react-redux'
import { NotConnected } from './NotConnected'
import { StakingOnGoing } from './StakingOnGoing'
import { StakingFinished } from './StakingFinished'
import { ConnectedNotStaked } from './ConnectedNotStaked'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useMemo } from 'react'
import { History } from './History'
import {
  useReadStakingContractGetUserStakes,
  useReadStakingContractStakingEnded
} from '@/contracts/Staking'

type BoxContentProps = {
  isHistoryPage: boolean
  onBackClick: () => void
}

export const BoxContent: React.FC<BoxContentProps> = ({
  onBackClick,
  isHistoryPage
}) => {
  const isStakingEnded = useReadStakingContractStakingEnded()
  const { address } = useUserInfo()
  const userStakes = useReadStakingContractGetUserStakes({
    args: [address]
  })

  const staked = useMemo(() => userStakes?.data?.length, [userStakes])
  const stakingStatus = useSelector(getStakingStatus)

  const renderContent = useMemo(() => {
    if (address) {
      if (isHistoryPage) {
        return <History onBackClick={onBackClick} />
      }

      if (isStakingEnded.data) {
        return <StakingFinished />
      }

      if (staked) {
        return <StakingOnGoing />
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
  }, [
    address,
    isHistoryPage,
    isStakingEnded.data,
    onBackClick,
    stakingStatus,
    staked
  ])

  return (
    <div className="absolute left-1/2 top-[300px] z-10 -translate-x-1/2">
      <div className="relative">{renderContent}</div>
    </div>
  )
}
