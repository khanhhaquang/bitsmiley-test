import { getStakingStatus } from '@/store/stakingStatus/reducer'
import { StakingStatus } from '@/types/status'
import { useSelector } from 'react-redux'
import { NotConnected } from './NotConnected'
import { ConnectedNotStaked } from './ConnectedNotStaked'
import { useUserInfo } from '@/hooks/useUserInfo'

export const BoxContent: React.FC = () => {
  const { address } = useUserInfo()
  const stakingStatus = useSelector(getStakingStatus)

  if (address) {
    return <ConnectedNotStaked />
  }

  switch (stakingStatus) {
    case StakingStatus.NotConnected:
      return <NotConnected />
    case StakingStatus.ConnectedNotStaked:
      return <ConnectedNotStaked />
    default:
      return <NotConnected />
  }
}
