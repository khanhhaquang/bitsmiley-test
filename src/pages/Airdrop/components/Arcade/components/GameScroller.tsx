import { useEffect, useMemo, useState } from 'react'

import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import styles from './GameScroller.module.scss'
import { PrizeType } from '../index.types'
import { PrizeStyle } from './PrizeOption'
import StrokeText from '@/components/StrokeText'

const GameScroller: React.FC<{
  scroll: boolean
  prize: PrizeType
  onStop: () => void
}> = ({ scroll, prize, onStop }) => {
  const [indexes, setIndexes] = useState<number[]>([0, 1, 2, 3, 4])
  const [duration] = useState(500)
  const data = [false, false, false, true, false]
  const [amount, icon, iconWidth, iconHeight] = PrizeStyle[`${prize}`]
  const items = useMemo(() => {
    const halfIndex = Math.floor(data.length / 2)
    return data.map((v, i) => {
      const pos = indexes.indexOf(i)
      const movement = pos === halfIndex ? 0 : (pos - halfIndex) * 180
      const moveToRight = movement >= 180 * halfIndex
      console.log('movement:', movement, moveToRight)
      return (
        <div
          className="absolute size-[160px]"
          style={{
            zIndex: moveToRight ? 1 : 10,
            // display: moveToRight ? 'none' : 'block',
            // opacity: moveToRight ? 0 : 1,
            transform: `translateX(${movement}px)`,
            transition: `all ${duration}ms ease`,
            animationFillMode: 'forwards',
            backgroundImage: `url(${getIllustrationUrl(
              v ? 'arcade-prize-bg' : 'arcade-face',
              'webp'
            )})`
          }}>
          {/* <div className=" text-white">
            {i} {moveToRight ? 0 : 1}
          </div> */}
          {v && (
            <div
              className="flex size-[160px] flex-col items-center justify-center gap-1 pt-10 bg-no-repeat"
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
  }, [indexes, prize])

  useEffect(() => {
    console.log('indexes', indexes)
  }, [data])

  useEffect(() => {
    if (!scroll) return
    setTimeout(() => {
      setIndexes((prev) => {
        const head = prev.shift()
        return [...prev, head!]
      })
    }, duration)
    setTimeout(() => {
      onStop()
    }, 4000)
  }, [indexes, scroll, duration])
  return (
    <div className="relative mt-3 flex h-[240px] w-[775px] items-center overflow-hidden">
      <Image
        src={getIllustrationUrl('arcade-pointer', 'webp')}
        className="absolute top-0 left-12 z-20 h-[68.5px] w-[677px]"
      />
      <div className={cn('w-[160px] h-[160px]', styles.slideContainer)}>
        {items}
      </div>
    </div>
  )
}

export default GameScroller
