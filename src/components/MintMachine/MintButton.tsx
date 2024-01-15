import { useMemo, useState } from 'react'
import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useInscribe } from '@/hooks/useInscribe'

export const MintButton: React.FC<{
  enabled?: boolean
  onInscribe: () => void
}> = ({ onInscribe, enabled }) => {
  const { inscribe, isInscribing } = useInscribe()
  const [isPressed, setIsPressed] = useState(false)

  const isMintButtonDisabled = !enabled || isInscribing

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
        onMouseUp={async () => {
          if (isMintButtonDisabled) return
          setIsPressed(false)

          const res = await inscribe()
          if (res) onInscribe()
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
