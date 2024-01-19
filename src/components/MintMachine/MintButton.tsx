import { useMemo, useState } from 'react'
import { cn } from '@/utils/cn'
import { Image } from '@/components/Image'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useInscribe } from '@/hooks/useInscribe'
import { CanvasFrames } from '../CanvasFrames'
import { AddressStauts } from '@/types/status'
import { useSelector } from 'react-redux'
import { getAddressStatus, getIsCreatingOrder } from '@/store/account/reducer'

export const MintButton: React.FC = () => {
  const addressStauts = useSelector(getAddressStatus)
  const isCreatingOrder = useSelector(getIsCreatingOrder)
  const { inscribe } = useInscribe()
  const [isPressed, setIsPressed] = useState(false)

  const isMintButtonDisabled =
    addressStauts === AddressStauts.Promotion ||
    addressStauts === AddressStauts.NotStarted ||
    addressStauts === AddressStauts.NotConnected ||
    addressStauts === AddressStauts.InscriptionSucceeded ||
    addressStauts === AddressStauts.Inscribing ||
    isCreatingOrder

  const mintButtonImgName = useMemo(() => {
    if (isMintButtonDisabled) return 'mintbutton-disabled'
    if (isPressed) return 'mintbutton-down'
    return 'mintbutton-up'
  }, [isMintButtonDisabled, isPressed])

  return (
    <>
      {!isMintButtonDisabled && (
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
      <div
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={async () => {
          if (isMintButtonDisabled) return

          setIsPressed(false)

          if (addressStauts === AddressStauts.NotInscribed) {
            inscribe()
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