import { useRive } from '@rive-app/react-canvas'
import { useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ArcadeButton } from './ArcadeButton'

const LockedTokensModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const [isInfoDisplayed, setIsInfoDisplayed] = useState(false)

  const handleClose = () => {
    onClose()
    setIsInfoDisplayed(false)
  }

  const { RiveComponent: LockedCoinsRive } = useRive({
    src: '/rive/locked-coins.riv',
    autoplay: true,
    onStop: () => {
      setIsInfoDisplayed(true)
    }
  })

  return (
    <Modal isOpen={isOpen} backdrop={false} onClose={handleClose}>
      <div className="relative  flex w-[540px] flex-col items-center pt-[150px]">
        <div className="absolute -top-1/2 left-1/2 h-[500px] w-[650px] -translate-x-1/2">
          <LockedCoinsRive />
        </div>
        <div
          className={cn(
            'relative flex w-full flex-col border border-[#ffd000] opacity-0 transition-all scale-0',
            isInfoDisplayed && 'opacity-100 scale-100'
          )}>
          <div
            className="relative flex h-[43px] w-full items-center justify-center bg-[#FFD000] font-smb2 text-2xl uppercase text-black"
            style={{
              textShadow: '1.839px 0px 0px rgba(0, 0, 0, 0.25)'
            }}>
            UNLOCKED SOON!
          </div>

          <div className="relative flex w-full flex-col items-center gap-y-6 bg-black py-6">
            <div className="flex justify-center gap-x-6">
              <div className="relative flex h-[106px] w-[238px] flex-col items-center justify-center font-ibmb">
                <Image
                  className="absolute inset-0"
                  src={getIllustrationUrl(
                    'locked-tokens-modal-value-bg',
                    'webp'
                  )}
                />
                <span className="relative text-base uppercase text-white">
                  Locked $smile
                </span>
                <span className="relative flex items-center gap-x-2 text-4xl text-[#FFD000]">
                  <SmileyIcon width={29} height={31} className="text-white" />{' '}
                  4500
                </span>
              </div>
              <div className="relative flex h-[106px] w-[238px] flex-col items-center justify-center font-ibmb">
                <Image
                  className="absolute inset-0"
                  src={getIllustrationUrl(
                    'locked-tokens-modal-value-bg',
                    'webp'
                  )}
                />
                <span className="relative text-base uppercase text-white">
                  Locked for
                </span>
                <span className="relative flex items-center gap-x-2 text-4xl text-white/75">
                  100 Days
                </span>
              </div>
            </div>
            <p className="w-[390px] text-center font-ibmr">
              You didn’t lose your $SMILE, we only locked it. Try your better
              luck this time?
            </p>
            <ArcadeButton
              className="h-[45px] w-[265px]"
              onClick={() => handleClose()}>
              Try again
            </ArcadeButton>

            <Image
              width={180}
              className="pointer-events-none absolute bottom-0 left-0 aspect-[357/396]"
              src={getIllustrationUrl('locked-tokens-modal-smile', 'webp')}
            />
            <Image
              width={180}
              className="pointer-events-none absolute bottom-0 right-0 aspect-[357/396] scale-x-[-1]"
              src={getIllustrationUrl('locked-tokens-modal-smile', 'webp')}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default LockedTokensModal
