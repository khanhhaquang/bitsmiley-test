import { useMemo, useState } from 'react'
import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getAssetsUrl'
import { CanvasFrames } from '@/components/CanvasFrames'
import { useUserInfo } from '@/hooks/useUserInfo'

export const HistoryButton: React.FC = () => {
  const { address } = useUserInfo()
  const [isPressed, setIsPressed] = useState(false)

  const isDisabled = !address

  const buttonImgName = useMemo(() => {
    if (isDisabled) return 'history-button-disabled'
    if (isPressed) return 'history-button-down'
    return 'history-button-up'
  }, [isDisabled, isPressed])

  return (
    <>
      {!isDisabled && (
        <div className="absolute left-[782px] top-[560px]">
          <CanvasFrames
            fps={10}
            width={45}
            height={70}
            imgLocalPaths={Array(13)
              .fill(1)
              .map((_, idx) =>
                getFrameUrl('arrow-indicator', `arrow-indicator${idx + 1}`)
              )}
          />
        </div>
      )}
      <button
        type="button"
        onMouseUp={async () => setIsPressed(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseLeave={() => setIsPressed(false)}
        className={cn(
          'absolute left-[740px] top-[626px] z-50 h-[76px]',
          'flex flex-col justify-end',
          !isDisabled && 'cursor-pointer',
          isDisabled && 'cursor-not-allowed'
        )}>
        <Image src={getIllustrationUrl(buttonImgName)} />
      </button>
    </>
  )
}
