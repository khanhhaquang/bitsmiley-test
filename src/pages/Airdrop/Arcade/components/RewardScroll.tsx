import { FC, useEffect, useMemo, useState } from 'react'

import { Image } from '@/components/Image'
import StrokeText from '@/components/StrokeText'
import { useSound } from '@/hooks/useSound'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { PrizeStyle } from './PrizeOption'

import { PrizeType } from '../index.types'
import {
  CAR_WINNING_INDEX,
  getRandomRewardIndex,
  getRandomTokensWinningIndex,
  Reward,
  REWARDS_NO_CAR,
  REWARDS_WITH_CAR,
  TOKENS_WINNING_INDEXS
} from './RewardsScroll.types'

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

const CarPrize: FC = () => {
  return (
    <div className="relative flex size-[160px] flex-col items-center justify-center">
      <Image
        src={getIllustrationUrl('tesla-car-prize', 'webp')}
        width={186}
        height={112}
      />
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
const DURATION = 3000
const INITIAL_POS = 0

const RewardScroll: React.FC<{
  prizeType: PrizeType
  isScrolling: boolean
  displayCar?: boolean
  reward?: Reward
  onEnd?: () => void
}> = ({ prizeType, displayCar, isScrolling, reward = Reward.Empty, onEnd }) => {
  const [resetPos, setResetPos] = useState(INITIAL_POS)
  const [randomIndex, setRandomIndex] = useState(getRandomRewardIndex())
  const [isEnded, setIsEnded] = useState(false)

  const reelingAudio = useSound('arcade-reeling')
  const winningAudio = useSound('arcade-winning')
  const losingAudio = useSound('arcade-losing')

  const rewards = useMemo(() => {
    return displayCar ? REWARDS_WITH_CAR : REWARDS_NO_CAR
  }, [displayCar])

  const landingIndex = useMemo(() => {
    if (reward === Reward.Car) {
      return CAR_WINNING_INDEX
    }

    if (reward === Reward.Tokens) {
      return TOKENS_WINNING_INDEXS.includes(randomIndex)
        ? randomIndex
        : getRandomTokensWinningIndex()
    }

    return TOKENS_WINNING_INDEXS.includes(randomIndex)
      ? randomIndex - 1
      : randomIndex
  }, [reward, randomIndex])

  const landingPos = useMemo(() => {
    const rewardsCount = rewards.length
    const landingPos =
      itemDimension * (Math.floor(rewardsCount / 2) + 1) + // set to start of order: ;
      itemDimension * rewardsCount * 3 + // move to next 3 orders
      landingIndex * itemDimension // move to reward index
    return landingPos
  }, [landingIndex, rewards])

  const rewardElements = useMemo(() => {
    return rewards.map((i, index) => {
      if (i === Reward.Empty) {
        return (
          <EmptyPrize
            key={`${i}- ${index}`}
            isReached={landingIndex === index && isEnded}
          />
        )
      } else if (i === Reward.Tokens) {
        return <TokenPrize key={`${i}- ${index}`} prizeType={prizeType} />
      } else {
        return <CarPrize key={`${i}- ${index}`} />
      }
    })
  }, [isEnded, landingIndex, prizeType, rewards])

  useEffect(() => {
    if (isScrolling) {
      reelingAudio.play()
      setTimeout(
        () => {
          onEnd?.()
          setIsEnded(false)
          setResetPos(INITIAL_POS)
          setRandomIndex(getRandomRewardIndex())
        },
        reward !== Reward.Empty ? DURATION + 2000 : DURATION + 3000
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
          if (reward !== Reward.Empty) {
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
      </div>
    </div>
  )
}

export default RewardScroll
