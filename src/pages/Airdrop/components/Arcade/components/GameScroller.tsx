import { useEffect, useMemo, useState } from 'react'

import { Image } from '@/components/Image'
import StrokeText from '@/components/StrokeText'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { getRandomInt } from '@/utils/number'

import styles from './GameScroller.module.scss'
import { PrizeStyle } from './PrizeOption'

import { PrizeType } from '../index.types'

interface SpeedStep {
  speed: number
  timeout: number
}

const GameScroller: React.FC<{
  scroll: boolean
  prize: PrizeType
  isWon: boolean
  onStop: () => void
}> = ({ scroll, prize, isWon, onStop }) => {
  const speedSteps: SpeedStep[] = useMemo(() => {
    return [
      { speed: 500, timeout: 500 },
      { speed: 300, timeout: 600 },
      { speed: 100, timeout: 100 * (getRandomInt(10) + 40) },
      { speed: 300, timeout: 600 },
      { speed: 500, timeout: 0 }
    ]
  }, [scroll])
  const [step, setStep] = useState(0)
  const data = [false, false, false, false, true, false, false]
  const [indexArray, setIndexArray] = useState(
    Array.from({ length: data.length }, (_, index) => index)
  )
  const [prizePos, setPrizePos] = useState(data.findIndex((value) => value))
  const [amount, icon, iconWidth, iconHeight] = PrizeStyle[`${prize}`]
  const itemWidth = 180
  const halfIndex = Math.floor(data.length / 2)
  const items = useMemo(() => {
    return data.map((prizeItem, i) => {
      const pos = indexArray.indexOf(i)
      const movement = pos === halfIndex ? 0 : (pos - halfIndex) * itemWidth
      const moveToRight = movement >= itemWidth * halfIndex
      if (prizeItem) {
        setPrizePos(pos)
      }
      return (
        <div
          key={i}
          className="absolute size-[160px]"
          style={{
            zIndex: moveToRight ? 1 : 10,
            transform: `translateX(${movement}px)`,
            transition: moveToRight
              ? ''
              : `all ${speedSteps[step].speed}ms linear`,
            backgroundImage: `url(${getIllustrationUrl(
              prizeItem ? 'arcade-prize-bg' : 'arcade-face',
              'webp'
            )})`
          }}>
          {prizeItem && (
            <div
              className="flex size-[160px] flex-col items-center justify-center gap-1 bg-no-repeat pt-10"
              style={{
                backgroundImage: `url(${getIllustrationUrl(icon, 'webp')})`,
                backgroundPosition: 'center',
                backgroundSize: `${iconWidth * 1.3}px ${iconHeight * 1.3}px`
              }}>
              <StrokeText
                color="#FFD000"
                strokeColor="#4D2202"
                strokeWidth={4}
                className="font-ibmb text-xl [text-shadow:_1px_-1px_0px_rgba(0,0,0,0.25)]">
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
          )}
        </div>
      )
    })
  }, [indexArray, prize, step])

  const scrollToLeft = () => {
    setIndexArray((prev) => {
      const head = prev.shift()
      return [...prev, head!]
    })
  }

  useEffect(() => {
    if (!scroll) {
      setStep(0)
      return
    }
    const intervalId = setInterval(() => {
      scrollToLeft()
    }, speedSteps[step].speed)

    if (step < speedSteps.length - 1) {
      setTimeout(() => {
        setStep((prev) => prev + 1)
      }, speedSteps[step].timeout)
    } else {
      //scroll to prize
      let lastStep = getRandomInt(data.length)
      const prizeStep =
        prizePos >= halfIndex ? prizePos - halfIndex : halfIndex + 1 + prizePos
      if (isWon) {
        lastStep = prizeStep
      } else {
        if (lastStep === prizeStep) {
          lastStep = prizeStep + 1
        }
      }
      console.log(
        'isWon:',
        isWon,
        'prizeStep:',
        prizeStep,
        'lastStep:',
        lastStep
      )
      setTimeout(() => {
        onStop()
      }, speedSteps[step].speed * lastStep)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [scroll, step, speedSteps])
  return (
    <div className="relative mt-3 flex h-[240px] w-[775px] items-center overflow-hidden">
      <Image
        src={getIllustrationUrl('arcade-pointer', 'webp')}
        className="absolute left-12 top-0 z-20 h-[68.5px] w-[677px]"
      />
      <div className={cn('w-[160px] h-[160px]', styles.slideContainer)}>
        {items}
      </div>
    </div>
  )
}

export default GameScroller
