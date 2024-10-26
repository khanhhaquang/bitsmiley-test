import { useEffect, useMemo, useState } from 'react'

import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import styles from './GameScroller.module.scss'

const GameScroller: React.FC<{
  scroll: boolean
  onStop: () => void
}> = ({ scroll, onStop }) => {
  const [indexes, setIndexes] = useState<number[]>([])
  const [duration] = useState(500)
  const size = 7
  const data = useMemo(() => {
    setIndexes([0, 1, 2, 3, 4, 5, 6])
    return [0, 1, 0, 0, 0, 0, 0]
  }, [size])

  const items = useMemo(() => {
    const list = []
    const halfIndex = Math.floor(size / 2)
    for (let i = 0; i < size; i++) {
      const pos = indexes.indexOf(i)
      const movement = pos === halfIndex ? 0 : (pos - halfIndex) * 180
      const moveToRight = movement >= 180 * halfIndex
      console.log('movement:', movement, moveToRight)
      list.push(
        <div
          className="absolute size-[160px]"
          style={{
            zIndex: moveToRight ? 1 : 10,
            // display: moveToRight ? 'none' : 'block',
            transform: `translateX(${movement}px)`,
            transition: `all ${duration}ms ease`,
            animationFillMode: 'forwards'
          }}>
          <Image
            src={getIllustrationUrl('arcade-face', 'webp')}
            className="absolute size-[160px]"
          />
          <div className="absolute text-white">
            {i} {moveToRight ? 0 : 1}
          </div>
        </div>
      )
    }
    return list
  }, [indexes])

  useEffect(() => {
    // data.map((v,i)=>{
    //   setIndexes((prev)=>[...prev, i])
    // })
    console.log('indexes', indexes)
  }, [data])
  // const indexes = useMemo(()=>{

  // }, [data])
  useEffect(() => {
    if (!scroll) return
    setTimeout(() => {
      // setCenterIndex((prev) => (prev == size - 1 ? 0 : prev + 1))
      setIndexes((prev) => {
        const head = prev.shift()
        return [...prev, head!]
      })
    }, duration)

    // setTimeout(()=>{setDuration(400)},1000)
    // setTimeout(()=>{setDuration(300)},2000)
    // setTimeout(()=>{setDuration(200)},3000)
    // setTimeout(()=>{setDuration(300)},4000)
    // setTimeout(()=>{setDuration(400)},4500)
    setTimeout(() => {
      onStop()
    }, 4000)
  }, [indexes, scroll, duration])
  return (
    <div className="relative mt-3 flex h-[240px] w-[775px] items-center overflow-hidden">
      <Image
        src={getIllustrationUrl('arcade-pointer', 'webp')}
        className="absolute top-0 z-20 h-[68.5px] w-[677px]"
      />
      <div className={cn('w-[160px] h-[160px]', styles.slideContainer)}>
        {items}
      </div>
    </div>
  )
}

export default GameScroller
