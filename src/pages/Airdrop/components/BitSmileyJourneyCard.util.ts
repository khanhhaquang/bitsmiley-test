import { BitsmileyJourneyStatus } from '@/services/airdrop'
import { formatNumberAsTrunc } from '@/utils/number'

export const getJourneyStatusTitle = (
  status: BitsmileyJourneyStatus,
  airdropAmount: number
) => {
  switch (status) {
    case BitsmileyJourneyStatus.NOT_ENTITLED:
      return 'You are not entitled'
    case BitsmileyJourneyStatus.COMING_SOON:
      return 'Coming soon'
    case BitsmileyJourneyStatus.ACTIVE:
      return formatNumberAsTrunc(airdropAmount || '')
    default:
      return ''
  }
}
