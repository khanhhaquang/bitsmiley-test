import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useMemo, useState } from 'react'
export const NumberPad: React.FC = () => {
  const isNumberPadDisabled = true
  const [isHover, setIsHover] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const numberPadImgName = useMemo(() => {
    if (isNumberPadDisabled) return 'numberpad-default'
    if (isHover && !isPressed) return 'numberpad-hover'
    if (isHover && isPressed) return 'numberpad-pressed'

    return 'numberpad-default'
  }, [isNumberPadDisabled, isHover, isPressed])

  return (
    <>
      {!isNumberPadDisabled && (
        <div className="absolute left-[553px] top-[575px] h-[60px] w-[54px]">
          <Image src={getIllustrationUrl('indicator')} />
        </div>
      )}
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => {
          setIsHover(false)
          setIsPressed(false)
        }}
        className={cn(
          'absolute left-[515px] top-[648px] z-10 h-[69px] w-[133px]',
          !isNumberPadDisabled && 'cursor-pointer'
        )}>
        <Image src={getIllustrationUrl(numberPadImgName)} />
      </div>
    </>
  )
}
