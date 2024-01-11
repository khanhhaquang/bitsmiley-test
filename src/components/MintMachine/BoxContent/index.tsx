import {
  AccountStatus,
  NormalUserStatus,
  WhitelistUserStatus
} from '@/types/status'
import { GoldConnectedAndNotPayed } from './GoldConnectedAndNotPayed'
import { NormalConnectedAndNotPayed } from './NormalConnectedAndNotPayed'
import { PartyNotStarted } from './PartyNotStarted'
import { PartyStartedButNotConnectedWallet } from './PartyStartedButNotConnectedWallet'
import { WhitelistConnectedAndNotPayed } from './WhitelistConnectedAndNotPayed'
import { PayingPayment } from './PayingPayment'
import { WhitelistPayedButMintingNotStarted } from './WhitelistPayedButMintingNotStarted'
import { NormalPayedButMintingNotStarted } from './NormalPayedButMintingNotStarted'
import { WhitelistPayedMintStartedButNotInscribed } from './WhitelistPayedMintStartedButNotInscribed'
import { NormalPayedButLuckyDrawNotStarted } from './NormalPayedButLuckyDrawNotStarted'
import { RollingDice } from './RollingDice'
import { RolledDiceButNotOpened } from './RolledDiceButNotOpened'
import { FirstRolledDiceOpenedAndFailed } from './FirstRolledDiceOpenedAndFailed'
import { RolledDiceOpenedAndWon } from './RolledDiceOpenedAndWon'
import { SecondRolledDiceOpenedAndFailed } from './SecondRolledDiceOpenedAndFailed'
import { Inscribed } from './Inscribed'

const status = AccountStatus.PartyNotStarted as
  | AccountStatus
  | WhitelistUserStatus
  | NormalUserStatus
export const BoxContent: React.FC = () => {
  switch (status) {
    case AccountStatus.PartyNotStarted:
      return <PartyNotStarted />
    case AccountStatus.PartyStartedButNotConnectedWallet:
      return <PartyStartedButNotConnectedWallet />
    case WhitelistUserStatus.GoldConnectedAndNotPayed:
      return <GoldConnectedAndNotPayed />
    case WhitelistUserStatus.WhitelistConnectedAndNotPayed:
      return <WhitelistConnectedAndNotPayed />
    case NormalUserStatus.NormalConnectedAndNotPayed:
      return <NormalConnectedAndNotPayed />
    case WhitelistUserStatus.PayingPayment || NormalUserStatus.PayingPayment:
      return <PayingPayment />
    case WhitelistUserStatus.WhitelistPayedButMintingNotStarted:
      return <WhitelistPayedButMintingNotStarted />
    case NormalUserStatus.NormalPayedButMintingNotStarted:
      return <NormalPayedButMintingNotStarted />
    case WhitelistUserStatus.WhitelistPayedMintStartedButNotInscribed:
      return <WhitelistPayedMintStartedButNotInscribed />
    case NormalUserStatus.NormalPayedButLuckyDrawNotStarted:
      return <NormalPayedButLuckyDrawNotStarted />
    case NormalUserStatus.RollingDice:
      return <RollingDice />
    case NormalUserStatus.RolledDiceButNotOpened:
      return <RolledDiceButNotOpened />
    case NormalUserStatus.FirstRolledDiceOpenedAndFailed:
      return <FirstRolledDiceOpenedAndFailed />
    case NormalUserStatus.FirstRolledDiceOpenedAndWon ||
      NormalUserStatus.SecondRolledDiceOpenedAndWon:
      return <RolledDiceOpenedAndWon />
    case NormalUserStatus.SecondRolledDiceOpenedAndFailed:
      return <SecondRolledDiceOpenedAndFailed />
    case NormalUserStatus.NormalInscribed ||
      WhitelistUserStatus.WhitelistInscribed:
      return <Inscribed />
    default:
      return null
  }
}
