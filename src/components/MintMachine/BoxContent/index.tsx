import { useSelector } from 'react-redux'
import { AddressStauts } from '@/types/status'
import { Promotion } from './Promotion'
import { NotConnected } from './NotConnected'
import { NotInscribed } from './NotInscribed'
import { Inscribing } from './Inscribing'
import { getAddressStatus } from '@/store/account/reducer'
import { NotStarted } from './NotStarted'
import { InscriptionFailed } from './InscriptionFailed'
import { InscriptionSucceeded } from './InscriptionSucceeded'

export const BoxContent: React.FC = () => {
  const addressStauts = useSelector(getAddressStatus)

  switch (addressStauts) {
    case AddressStauts.Promotion:
      return <Promotion />
    case AddressStauts.NotConnected:
      return <NotConnected />
    case AddressStauts.NotStarted:
      return <NotStarted />
    case AddressStauts.NotInscribed:
      return <NotInscribed />
    case AddressStauts.Inscribing:
      return <Inscribing />
    case AddressStauts.InscriptionFailed:
      return <InscriptionFailed />
    case AddressStauts.InscriptionSucceeded:
      return <InscriptionSucceeded />
    default:
      return AddressStauts.Promotion
  }
}
