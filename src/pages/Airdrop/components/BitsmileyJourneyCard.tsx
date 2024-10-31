import { FC } from 'react'

import { BitsmileyJourney, BitsmileyJourneyStatus } from '@/services/airdrop'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { getJourneyStatusTitle } from './BitSmileyJourneyCard.util'

const BitsmileyJourneyCard: FC<BitsmileyJourney> = ({
  name,
  airdropAmount,
  mediumLink,
  status
}) => {
  const isNotEntitled = status === BitsmileyJourneyStatus.NOT_ENTITLED

  return (
    <div className="relative h-[162px] w-[274px] shrink-0 border-[1.5px] border-[#2648ef]/60 bg-[#000727] p-1 font-ibmr">
      <div className="relative z-[1] flex size-full flex-col justify-between">
        <div
          className={cn(
            'flex w-full capitalize items-center justify-center bg-blue p-[10px] text-center text-base text-white h-[90px] leading-6 font-bold',
            { 'opacity-40': isNotEntitled }
          )}>
          {name}
        </div>
        <div className="flex size-full flex-1 items-end justify-center bg-cover text-sm">
          <a
            href={mediumLink}
            target="_blank"
            rel="noopener noreferrer"
            className={cn('text-[#FFB800] underline', {
              'text-white': isNotEntitled
            })}>
            Rules
          </a>
        </div>
        <div className="flex h-[60px] w-full flex-col text-sm font-bold uppercase">
          <div
            className={cn('bg-repeat flex-1 flex justify-center pt-0.5')}
            style={{
              backgroundImage: `url(${getIllustrationUrl(
                isNotEntitled
                  ? 'journey-card-inactive-bg'
                  : 'journey-card-active-bg',
                'webp'
              )})`
            }}>
            <div
              className={cn('bg-[#120E1F] text-center px-5 text-[#FFB800]', {
                'text-[#8A8A8A]': isNotEntitled
              })}>
              airdrops
            </div>
          </div>
          <div
            className={cn(
              'bg-[#FFB800] flex-1 text-center text-black w-full py-1',
              {
                'bg-[#8A8A8A]': isNotEntitled
              }
            )}>
            {getJourneyStatusTitle(status, airdropAmount)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BitsmileyJourneyCard
