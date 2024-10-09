import { Address } from 'viem'

import { axiosInstance } from '@/config/axios'
import { IResponse } from '@/types/common'

export type BitsmileyJourneyType = 1 | 2 | 3 | 4 | 5 | 6

export enum BitsmileyJourneyStatus {
  NOT_ENTITLED = 0,
  COMING_SOON = 1,
  ACTIVE = 2
}

export const BitsmileyJourneyNames: Record<BitsmileyJourneyType, string> = {
  1: 'Invalid bit-Disc Black Inscription gas cover',
  2: 'Stake bit-Disc Black (bitJade)',
  3: 'The ruememe show',
  4: 'Pre-Season bitPoint',
  5: 'Season One bitPoint',
  6: 'Special: bitSmiley Community Events'
}

export interface BitsmileyJourney {
  walletAddress: Address
  type: BitsmileyJourneyType
  airdropAmount: number
  status: BitsmileyJourneyStatus
  mediumLink: string
  name?: string
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
  }
}
