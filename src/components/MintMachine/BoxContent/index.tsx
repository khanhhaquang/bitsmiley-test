import { AccountStatus } from '@/types/status'
import { PartyNotStarted } from './PartyNotStarted'
import { PartyStartedButNotConnected } from './PartyStartedButNotConnected'
import { NotInscribed } from './NotInscribed'
import { Inscribing } from './Inscribing'
import { Inscribed } from './Inscribed'

export const BoxContent: React.FC<{ status: AccountStatus }> = ({ status }) => {
  switch (status) {
    case AccountStatus.PartyNotStarted:
      return <PartyNotStarted />
    case AccountStatus.PartyStartedNotConnected:
      return <PartyStartedButNotConnected />
    case AccountStatus.NotInscribed:
      return <NotInscribed />
    case AccountStatus.Inscribing:
      return <Inscribing />
    case AccountStatus.Inscribed:
      return <Inscribed />
    default:
      return null
  }
}
