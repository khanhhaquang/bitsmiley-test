import { FC, Fragment, useEffect, useMemo, useRef } from 'react'

import { CloseIcon } from '@/assets/icons'
import { Modal } from '@/components/Modal'
import { useGetMyBitsmileyJourney } from '@/hooks/useAirdropQueries'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { useGetArcadeLuckyAccount } from '@/queries/airdrop'
import { BitsmileyJourneyNames, BitsmileyJourneyType } from '@/services/airdrop'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

import BitsmileyJourneyCard from './BitsmileyJourneyCard'
import CommunityJourneyCard from './CommunityJourneyCard'

const MyJourneyModal: FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { data: luckyAccount } = useGetArcadeLuckyAccount()
  const { data: myJourney } = useGetMyBitsmileyJourney()
  const { isMobile } = useMediaQuery()
  const cardsRef = useRef<HTMLDivElement>(null)

  const communityJourney = useMemo(
    () =>
      myJourney?.find(
        (item) => item?.type === BitsmileyJourneyType.SPECIAL_COMMUNITY_EVENTS
      ),
    [myJourney]
  )

  const listNormalJourney = useMemo(
    () =>
      myJourney?.filter(
        (item) => item?.type !== BitsmileyJourneyType.SPECIAL_COMMUNITY_EVENTS
      ) || [],
    [myJourney]
  )

  const onWheel = (event: WheelEvent) => {
    if (event?.deltaY !== 0 && cardsRef?.current) {
      const { scrollWidth, scrollLeft, clientWidth, scrollTop } =
        cardsRef.current
      const maxScrollWidth = scrollWidth - clientWidth
      const calculatedScrollWidth = scrollLeft + event.deltaY * 5

      const isPositionBetweenScroll = (position: number) =>
        position > 0 && position < maxScrollWidth

      if (
        isPositionBetweenScroll(scrollLeft) ||
        isPositionBetweenScroll(calculatedScrollWidth)
      ) {
        // do horizontal scroll until it reach to maximum width, then do vertical scroll
        cardsRef.current?.scroll(calculatedScrollWidth, scrollTop)
        event.preventDefault()
      }
    }
  }

  useEffect(() => {
    const currentCardRef = cardsRef.current
    if (!isMobile && isOpen) {
      currentCardRef?.addEventListener('wheel', onWheel)
    }
    return () => {
      currentCardRef?.removeEventListener('wheel', onWheel)
    }
  }, [isMobile, isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} backdrop={false}>
      <div className="relative flex w-[794px] flex-col bg-black py-9">
        <button onClick={onClose} className="absolute right-4 top-4 text-white">
          <CloseIcon width={18} height={17} />
        </button>
        <div className="flex w-full items-center justify-center">
          <img
            width={462}
            height={80}
            src={getIllustrationUrl('your-bitsmiley-journey', 'webp')}
          />
        </div>
        <div
          ref={cardsRef}
          className="scrollbar-none mt-9 flex w-full flex-nowrap items-center overflow-x-auto overflow-y-hidden pl-[92px] md:pr-10 lg:pr-20">
          {listNormalJourney?.map((item, index) => (
            <Fragment key={`${index}-${item?.type}`}>
              {index !== 0 && (
                <img
                  src={getIllustrationUrl('next-journey-chevron', 'webp')}
                  className="size-[30px] px-1 sm:rotate-90"
                />
              )}
              <BitsmileyJourneyCard
                {...item}
                name={BitsmileyJourneyNames[item?.type]}
              />
            </Fragment>
          ))}
        </div>
        <div className="mt-3 w-full px-[92px]">
          {communityJourney && <CommunityJourneyCard {...communityJourney} />}
        </div>

        <div className="mx-[92px] mt-6 border-y border-dashed border-[#FFB800]/40 py-2 font-psm text-base text-[#FFB800]">
          <p className="flex items-center justify-between">
            Total $SMILE:{' '}
            <span>
              {formatNumberWithSeparator(luckyAccount?.data.totalAirdrop || 0)}
            </span>
          </p>
          <p className="mt-2 flex items-center justify-between">
            Unlocked $SMILE now:{' '}
            <span>
              {formatNumberWithSeparator(
                luckyAccount?.data.availableAirdrop || 0
              )}
            </span>
          </p>
        </div>
      </div>
    </Modal>
  )
}

export default MyJourneyModal
