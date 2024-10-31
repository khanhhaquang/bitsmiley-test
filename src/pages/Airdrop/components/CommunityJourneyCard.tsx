import { FC } from 'react'

import {
  BitsmileyJourney,
  BitsmileyJourneyNames,
  BitsmileyJourneyStatus
} from '@/services/airdrop'
import { cn } from '@/utils/cn'

import { getJourneyStatusTitle } from './BitSmileyJourneyCard.util'

const CommunityJourneyCard: FC<BitsmileyJourney> = ({
  mediumLink,
  airdropAmount,
  status,
  type
}) => {
  const isCommunityJourneyNotEntitled =
    status === BitsmileyJourneyStatus.NOT_ENTITLED

  return (
    <div className="flex w-full justify-center">
      <div className="flex w-full flex-col gap-1 border-2 border-[#FFB800]/60 bg-[#221901] p-1 font-ibmr text-base font-bold leading-5 sm:text-xl sm:leading-4">
        <div className="flex w-full justify-between bg-[#FFB800]/20 px-6 py-[10px] sm:flex-col sm:items-center sm:text-center">
          <div
            className={cn('capitalize', {
              'opacity-60': isCommunityJourneyNotEntitled
            })}>
            {BitsmileyJourneyNames[`${type}`]}
          </div>
          <a
            href={mediumLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('text-white/60 underline', {
              'text-white': isCommunityJourneyNotEntitled
            })}>
            Rules
          </a>
        </div>
        <div
          className={cn(
            'bg-[#FFB800] uppercase flex w-full justify-between px-6 py-[10px] text-black sm:flex-col sm:items-center',
            { 'bg-[#8A8A8A]': isCommunityJourneyNotEntitled }
          )}>
          <div>airdrops</div>
          <div>{getJourneyStatusTitle(status, airdropAmount)}</div>
        </div>
      </div>
    </div>
  )
}

export default CommunityJourneyCard
