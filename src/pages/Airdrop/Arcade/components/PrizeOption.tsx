import { Image } from '@/components/Image'
import StrokeText from '@/components/StrokeText'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { PrizeType } from '../index.types'

export const PrizeStyle: Record<PrizeType, [number, string, number, number]> = {
  [PrizeType.SMILE_100]: [100, 'prize-100-icon', 90, 60.6],
  [PrizeType.SMILE_1000]: [1000, 'prize-1000-icon', 90, 60.6],
  [PrizeType.SMILE_5000]: [5000, 'prize-5000-icon', 90, 60.6],
  [PrizeType.SMILE_10000]: [10000, 'prize-10000-icon', 90, 60.6]
} as const

export const Prizes: Record<PrizeType, number> = {
  [PrizeType.SMILE_100]: 100,
  [PrizeType.SMILE_1000]: 1000,
  [PrizeType.SMILE_5000]: 5000,
  [PrizeType.SMILE_10000]: 10000
} as const

const PrizeOption: React.FC<{
  type: PrizeType
  selected: boolean
  onSelect: (value: PrizeType) => void
}> = ({ type, selected, onSelect }) => {
  const [amount, icon, iconWidth, iconHeight] = PrizeStyle[`${type}`]
  return (
    <div
      className={cn(
        'w-[210px] h-[106px] bg-contain flex items-center justify-center cursor-pointer',
        selected ? 'bg-prizeBgActive' : 'bg-prizeBg'
      )}
      onClick={() => onSelect(type)}>
      <div
        className="flex h-[106px] w-[210px] flex-col items-center justify-center gap-4 bg-no-repeat"
        style={{
          backgroundImage: `url(${getIllustrationUrl(icon, 'webp')})`,
          backgroundPosition: 'center',
          backgroundSize: `${iconWidth}px ${iconHeight}px`
        }}>
        <div className="flex gap-2">
          <StrokeText
            color="#FFD000"
            strokeColor="#4D2202"
            strokeWidth={4}
            className="font-ibmb text-xl [text-shadow:_1px_-1px_0px_rgba(0,0,0,0.25)]">
            PRIZE
          </StrokeText>
          <Image
            src={getIllustrationUrl('prize-face', 'webp')}
            className="size-[20]"
          />
        </div>
        <StrokeText
          color="#FFD000"
          strokeColor="#4D2202"
          strokeWidth={8}
          className="font-smb text-2xl [text-shadow:_2px_-2px_0px_rgba(0,0,0,0.25)]">
          {amount}
        </StrokeText>
      </div>
    </div>
  )
}

export default PrizeOption
