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
import { OnChainLoading } from './OnchainLoading'

type BoxContentProps = {
  isHistoryPage: boolean
  onBackClick: () => void
}

export const BoxContent: React.FC<BoxContentProps> = ({
  onBackClick,
  isHistoryPage
}) => {
  const { address } = useUserInfo()
  const { data: isStakingEnded, isLoading: isFetchingIsStakingEnded } =
    useReadStakingContractStakingEnded()
  const { data: userStakes, isLoading: isFetchingUserStakes } =
    useReadStakingContractGetUserStakes({
      args: [address]
    })

  const staked = useMemo(() => userStakes?.length, [userStakes])

  const renderContent = useMemo(() => {
    if (address) {
      if (isFetchingUserStakes || isFetchingIsStakingEnded) {
        return <OnChainLoading />
      }
      if (isHistoryPage) {
        return <History onBackClick={onBackClick} />
      }
      if (isStakingEnded) {
        return <StakingFinished />
      }
      if (staked) {
        return <StakingOnGoing />
      }
      return <ConnectedNotStaked />
    }
    return <NotConnected />
  }, [
    address,
    isHistoryPage,
    isFetchingUserStakes,
    isFetchingIsStakingEnded,
    isStakingEnded,
    staked,
    onBackClick
  ])

  return (
    <div className="absolute left-1/2 top-[300px] z-10 -translate-x-1/2">
      <div className="relative">{renderContent}</div>
    </div>
  )
}
