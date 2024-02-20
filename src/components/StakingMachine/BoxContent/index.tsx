import { getStakingStatus } from '@/store/stakingStatus/reducer'
import { StakingStatus } from '@/types/status'
import { useSelector } from 'react-redux'
import { NotConnected } from './NotConnected'
import { ConnectedNotStaked } from './ConnectedNotStaked'

export const BoxContent: React.FC = () => {
  const stakingStatus = useSelector(getStakingStatus)

  switch (stakingStatus) {
    case StakingStatus.NotConnected:
      return <NotConnected />
    case StakingStatus.ConnectedNotStaked:
      return <ConnectedNotStaked />
    default:
      return <NotConnected />
  }
}
