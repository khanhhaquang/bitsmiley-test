import { useSelector } from 'react-redux'
import { AddressStauts } from '@/types/status'

import { getAddressStatus } from '@/store/addressStatus/reducer'

import { Promotion } from './Promotion'
import { Inscribing } from './Inscribing'
import { NotStarted } from './NotStarted'
import { NotConnected } from './NotConnected'
import { NotInscribed } from './NotInscribed'
import { MintingEnded } from './MintingEnded'
import { DisableMinting } from './DisableMinting'
import { InscriptionFailed } from './InscriptionFailed'
import { CheckingInscription } from './CheckingInscription'
import { InscriptionSucceeded } from './InscriptionSucceeded'

export const BoxContent: React.FC = () => {
  const addressStauts = useSelector(getAddressStatus)

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
    case AddressStauts.DisableMinting:
      return <DisableMinting />
    case AddressStauts.InscriptionSucceeded:
      return <InscriptionSucceeded />
    case AddressStauts.MintingEnded:
      return <MintingEnded />
    default:
      return <Promotion />
  }
}
