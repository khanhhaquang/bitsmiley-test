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
import { CheckingInscription } from './CheckingInscription'
import { useAddressStatus } from '@/hooks/useAddressStatus'

export const BoxContent: React.FC = () => {
  const { isLoading } = useAddressStatus()
  const addressStauts = useSelector(getAddressStatus)

  if (isLoading) {
    return <CheckingInscription />
  }

  switch (addressStauts) {
    case AddressStauts.Promotion:
      return <Promotion />
    case AddressStauts.NotConnected:
      return <NotConnected />
    case AddressStauts.CheckingInscription:
      return <CheckingInscription />
    case AddressStauts.NotStarted:
      return <NotStarted />
    case AddressStauts.NotInscribed:
      return <NotInscribed />
    case AddressStauts.Inscribing:
    case AddressStauts.InscriptionConfirmed:
      return <Inscribing />
    case AddressStauts.InscriptionFailed:
      return <InscriptionFailed />
    case AddressStauts.InscriptionSucceeded:
      return <InscriptionSucceeded />
    default:
      return <Promotion />
  }
}
