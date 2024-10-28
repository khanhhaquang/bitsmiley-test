import { Address } from 'viem'

import { axiosInstance, privateAxiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'

export enum BitsmileyJourneyType {
  BITDISC_GAS_COVER = 1,
  STAKE_BIT_DISC = 2,
  THE_RUEMEME_SHOW = 3,
  PRE_SEASON_BITPOINT = 4,
  SEASON_ONE_BITPOINT = 5,
  SPECIAL_COMMUNITY_EVENTS = 6
}

export enum BitsmileyJourneyStatus {
  NOT_ENTITLED = 0,
  COMING_SOON = 1,
  ACTIVE = 2
}

export const BitsmileyJourneyNames: Record<BitsmileyJourneyType, string> = {
  [BitsmileyJourneyType.BITDISC_GAS_COVER]:
    'Invalid bit-Disc Black Inscription gas cover',
  [BitsmileyJourneyType.STAKE_BIT_DISC]: 'Stake bit-Disc Black (bitJade)',
  [BitsmileyJourneyType.THE_RUEMEME_SHOW]: 'The Truememe show',
  [BitsmileyJourneyType.PRE_SEASON_BITPOINT]: 'Pre-Season bitPoint',
  [BitsmileyJourneyType.SEASON_ONE_BITPOINT]: 'Season One bitPoint',
  [BitsmileyJourneyType.SPECIAL_COMMUNITY_EVENTS]:
    'Special: bitSmiley Community Events'
}

export interface BitsmileyJourney {
  walletAddress: Address
  type: BitsmileyJourneyType
  airdropAmount: number
  status: BitsmileyJourneyStatus
  mediumLink: string
  name?: string
}

export interface ArcadeLuckyAccount {
  totalAirdrop: number
  availableAirdrop: number
  haveWon: number
  locked: number
}

export interface BuyArcadeLuckyPayload {
  type: number
  participationAmount: string
}

export interface BuyArcadeLuckyResponse {
  winAmount: number
  isWin: boolean
}

export const AirdropService = {
  getMyBitsmileyJourney: {
    key: 'airdrop.getMyBitsmileyJourney',
    call: (address: Address) =>
      axiosInstance
        .get<IResponse<BitsmileyJourney[]>>(
          `/airdrop/getMyBitSmileyJourney/${address}`
        )
        .then((res) => res.data)
  },
  getArcadeLuckyAccount: {
    key: 'airdrop.getArcadeLuckyAccount',
    call: () =>
      privateAxiosInstance
        .get<IResponse<ArcadeLuckyAccount>>(`/luck_buy/getAccount`)
        .then((res) => res.data)
  },
  buyArcadeLucky: {
    key: 'airdrop.buyArcadeLucky',
    call: (payload: BuyArcadeLuckyPayload) =>
      privateAxiosInstance
        .post<IResponse<BuyArcadeLuckyResponse>>(`/luck_buy/luck`, payload)
        .then((res) => res.data)
  }
}