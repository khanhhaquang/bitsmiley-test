import { FC, useEffect, useMemo, useState } from 'react'

import { Image } from '@/components/Image'
import StrokeText from '@/components/StrokeText'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { PrizeStyle } from './PrizeOption'

import { PrizeType } from '../index.types'
import { useSound } from '@/hooks/useSound'

const TokenPrize: FC<{ prizeType: PrizeType }> = ({ prizeType }) => {
  const [amount, iconName, iconWidth, iconHeight] = PrizeStyle[`${prizeType}`]
  return (
    <div
      className="relative flex size-[160px] flex-col items-center justify-center gap-y-1"
      style={{
        backgroundImage: `url(${getIllustrationUrl('arcade-prize-bg', 'webp')})`
      }}>
      <Image
        src={getIllustrationUrl(iconName, 'webp')}
        width={iconWidth}
        height={iconHeight}
        className={cn(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-125',
          prizeType > 2 ? 'scale-150' : 'scale-[110%]'
        )}
      />
      <StrokeText
        color="#FFD000"
        strokeColor="#4D2202"
        strokeWidth={4}
        className="mt-10 font-smb2 text-base [text-shadow:_1px_-1px_0px_rgba(0,0,0,0.25)]">
        $SMILE
      </StrokeText>
      <StrokeText
        color="#FFD000"
        strokeColor="#4D2202"
        strokeWidth={8}
        className="font-smb text-3xl [text-shadow:_2px_-2px_0px_rgba(0,0,0,0.25)]">
        {amount}
      </StrokeText>
    </div>
  )
}

const EmptyPrize: FC<{ isReached: boolean }> = ({ isReached }) => {
  return (
    <div
      className="relative flex size-[160px] flex-col items-center justify-center gap-y-1"
      style={{
        backgroundImage: `url(${getIllustrationUrl(
          'arcade-face',
          isReached ? 'gif' : 'webp'
        )})`,
        backgroundSize: '100% 100%'
      }}
    />
  )
}

const itemDimension = 160 + 24
const getRandomIndex = () => Math.floor(Math.random() * REWARDS.length)

const REWARDS = [false, false, false, false, true, false, false]
const DURATION = 3000
const INITIAL_POS = 0

const RewardScroll: React.FC<{
  prizeType: PrizeType
  isScrolling: boolean
  isWinning?: boolean
  onEnd?: (v: boolean) => void
}> = ({ prizeType, isWinning, isScrolling, onEnd }) => {
  const [resetPos, setResetPos] = useState(INITIAL_POS)
  const [randomIndex, setRandomIndex] = useState(getRandomIndex())
  const [isEnded, setIsEnded] = useState(false)

  const reelingAudio = useSound('arcade-reeling')
  const winningAudio = useSound('arcade-winning')
  const losingAudio = useSound('arcade-losing')

  const landingIndex = useMemo(
    () => (isWinning ? 4 : randomIndex === 4 ? randomIndex - 1 : randomIndex),
    [isWinning, randomIndex]
  )

  const landingPos = useMemo(() => {
    const landingPos =
      itemDimension * 4 + // set to start of order
      itemDimension * REWARDS.length * 4 + // move to next 4 orders
      landingIndex * itemDimension // move to reward index
    return landingPos
  }, [landingIndex])

  const rewardElements = useMemo(() => {
    return REWARDS.map((i, index) =>
      i ? (
        <TokenPrize key={`${i}- ${index}`} prizeType={prizeType} />
      ) : (
        <EmptyPrize
          key={`${i}- ${index}`}
          isReached={landingIndex === index && isEnded}
        />
      )
    )
  }, [isEnded, landingIndex, prizeType])

  useEffect(() => {
    if (isScrolling) {
      reelingAudio.play()
      setIsEnded(false)
      setTimeout(
        () => {
          onEnd?.(!!isWinning)
          setIsEnded(false)
          setResetPos(INITIAL_POS)
          setRandomIndex(getRandomIndex())
        },
        isWinning ? DURATION + 2000 : DURATION + 3000
      )
    }
  }, [isScrolling])

  return (
    <div className="relative mt-3 flex h-[220px] w-[775px] items-center justify-center overflow-hidden pt-3">
      <Image
        src={getIllustrationUrl('arcade-pointer', 'webp')}
        className="absolute left-12 top-[-8px] z-20 h-[68.5px] w-[677px]"
      />

      <div
        className={cn('flex items-center flex-nowrap gap-x-6 w-fit px-6')}
        onTransitionEnd={() => {
          setIsEnded(true)
          if (isWinning) {
            winningAudio.play()
          } else {
            losingAudio.play()
          }
        }}
        style={
          isScrolling
            ? {
                transitionDuration: `${DURATION}ms`,
                transitionTimingFunction: 'ease-in-out',
                transform: `translateX(-${landingPos}px)`
              }
            : {
                transitionDuration: '',
                transitionTimingFunction: '',
                transform: `translateX(${resetPos}px)`
              }
        }>
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
        {rewardElements}
      </div>
    </div>
  )
}

export default RewardScroll
