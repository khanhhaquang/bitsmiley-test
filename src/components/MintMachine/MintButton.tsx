import { useMemo, useState } from 'react'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { cn } from '@/utils/cn'

export const MintButton: React.FC<{ playCardComingout: () => void }> = ({
  playCardComingout
}) => {
  const isMintButtonDisabled = true
  const [isPressed, setIsPressed] = useState(false)

  const mintButtonImgName = useMemo(() => {
    if (isMintButtonDisabled) return 'mintbutton-disabled'
    if (isPressed) return 'mintbutton-down'
    return 'mintbutton-up'
  }, [isMintButtonDisabled, isPressed])

  return (
    <>
      {!isMintButtonDisabled && (
        <div className="absolute left-[782px] top-[568px] h-[60px] w-[54px]">
          <Image src={getIllustrationUrl('indicator')} />
        </div>
      )}
      <div
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => {
          setIsPressed(false)
          if (!isMintButtonDisabled) {
            playCardComingout()
          }
        }}
        onMouseLeave={() => setIsPressed(false)}
        className={cn(
          'absolute left-[740px] top-[624px] z-50',
          !isMintButtonDisabled && 'cursor-pointer'
        )}>
        <Image src={getIllustrationUrl(mintButtonImgName)} />
      </div>
    </>
  )
}
