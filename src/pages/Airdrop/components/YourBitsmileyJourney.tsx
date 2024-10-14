import { useEffect, useMemo, useRef } from 'react'

import { useGetMyBitsmileyJourney } from '@/hooks/useAirdropQueries'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { BitsmileyJourneyNames, BitsmileyJourneyType } from '@/services/airdrop'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import BitsmileyJourneyCard from './BitsmileyJourneyCard'
import CommunityJourneyCard from './CommunityJourneyCard'

const YourBitsmileyJourney = () => {
  const { data } = useGetMyBitsmileyJourney()
  const cardsRef = useRef<HTMLDivElement>(null)
  const { isMobile } = useMediaQuery()

  const communityJourney = useMemo(
    () =>
      data?.find(
        (item) => item?.type === BitsmileyJourneyType.SPECIAL_COMMUNITY_EVENTS
      ),
    [data]
  )

  const listNormalJourney = useMemo(
    () =>
      data?.filter(
        (item) => item?.type !== BitsmileyJourneyType.SPECIAL_COMMUNITY_EVENTS
      ),
    [data]
  )

  const onWheel = (event: WheelEvent) => {
    if (event?.deltaY !== 0) {
      cardsRef.current?.scroll(
        cardsRef.current.scrollLeft + event.deltaY * 5,
        cardsRef.current.scrollTop
      )
      event.preventDefault()
    }
  }

  useEffect(() => {
    const currentCardRef = cardsRef.current
    if (!isMobile) {
      currentCardRef?.addEventListener('wheel', onWheel)
    }
    return () => {
      currentCardRef?.removeEventListener('wheel', onWheel)
    }
  }, [isMobile])

  return (
    <div className="flex w-full flex-col gap-y-[60px]">
      <div className="flex w-full items-center justify-center overflow-hidden">
        <img
          src={getIllustrationUrl('your-bitsmiley-journey', 'webp')}
          className="h-auto min-h-[128px] min-w-[1926px] overflow-hidden sm:min-h-[90px] sm:min-w-[1000px]"
        />
      </div>
      <div
        ref={cardsRef}
        className="scrollbar-none m-auto flex w-full flex-col gap-y-[60px] overflow-x-auto sm:items-center sm:p-0 md:px-[100px] lg:px-[225px]">
        <div className="flex w-fit flex-nowrap items-center pb-1 sm:flex-col">
          {listNormalJourney?.map((item, index) => (
            <>
              {index !== 0 && (
                <img
                  src={getIllustrationUrl('next-journey-chevron', 'webp')}
                  className="size-10 px-1 sm:rotate-90"
                />
              )}
              <BitsmileyJourneyCard
                key={item?.type}
                {...item}
                name={BitsmileyJourneyNames[item?.type]}
              />
            </>
          ))}
        </div>
      </div>
      {communityJourney && <CommunityJourneyCard {...communityJourney} />}
    </div>
  )
}

export default YourBitsmileyJourney
