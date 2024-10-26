import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import styles from './GameScroller.module.scss'
import { useEffect, useMemo, useState } from 'react'

const GameScroller: React.FC<{
  scroll: boolean
  onStop: () => void
}> = ({ scroll, onStop }) => {
  const [centerIndex, setCenterIndex] = useState(2)
  const [startScroll, setStartScroll] = useState(false)
  const [indexes, setIndexes] = useState<number[]>([])
  const [duration, setDuration] = useState(500)
  const width = 775
  const size = 7
  const data = useMemo(() => {
    setIndexes([0, 1, 2, 3, 4,5,6])
    return [0, 1, 0, 0, 0,0,0]
  }, [size])

  const items = useMemo(() => {
    const list = []
    const halfIndex = Math.floor(size / 2)
    console.log('halfIndex:', halfIndex, 'centerIndex:', centerIndex)
    for (var i = 0; i < size; i++) {
      const pos = indexes.indexOf(i)
      let movement = pos === halfIndex ? 0 : (pos - halfIndex) * 180
      const moveToRight = movement >= 180 * halfIndex
      console.log('movement:', movement, moveToRight)
      list.push(
        <div
          className="h-[160px] w-[160px] absolute"
          style={{
            zIndex: moveToRight ? 1 : 10,
            // display: moveToRight ? 'none' : 'block',
            transform: `translateX(${movement}px)`,
            transition: `all ${duration}ms ease`,
            animationFillMode: 'forwards',
          }}>
          <Image
            src={getIllustrationUrl('arcade-face', 'webp')}
            className="h-[160px] w-[160px] absolute"
          />
          <div className="text-white absolute">
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
    if (!startScroll) return
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
    // setTimeout(()=>{setStartScroll(false)},4000)
  }, [indexes, startScroll, duration])
  return (
    <div className="relative w-[775px] h-[240px] mt-3 overflow-hidden flex items-center">
      <Image
            src={getIllustrationUrl('arcade-pointer', 'webp')}
            className="h-[68.5px] w-[677px] absolute top-0 z-20"
          />
      <div className={cn('w-[160px] h-[160px]', styles.slideContainer)}>
        {items}
      </div>
    </div>
  )
}

export default GameScroller
