import { useSelector } from 'react-redux'
import { InscribeStatus } from '@/types/status'
import { Promotion } from './Promotion'
import { NotConnected } from './NotConnected'
import { NotInscribed } from './NotInscribed'
import { Inscribed } from './Inscribed'
import { Inscribing } from './Inscribing'
import { getInscriptionStatus } from '@/store/account/reducer'
import { NotStarted } from './NotStarted'

export const BoxContent: React.FC = () => {
  const inscriptionStatus = useSelector(getInscriptionStatus)

  switch (inscriptionStatus) {
    case InscribeStatus.Promotion:
      return <Promotion />
    case InscribeStatus.NotConnected:
      return <NotConnected />
    case InscribeStatus.NotStarted:
      return <NotStarted />
    case InscribeStatus.NotInscribed:
      return <NotInscribed />
    case InscribeStatus.Inscribing:
      return <Inscribing />
    case InscribeStatus.Inscribed:
      return <Inscribed />
    default:
      return InscribeStatus.Promotion
  }
}
