import { useRive } from '@rive-app/react-canvas'
import { useState } from 'react'

import { SmileyIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import StrokeText from '@/components/StrokeText'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

import { ArcadeButton } from './ArcadeButton'

const CongratsModal: React.FC<{
  isOpen: boolean
  amount: number
  onClose: () => void
}> = ({ isOpen, amount, onClose }) => {
  const [isInfoDisplayed, setIsInfoDisplayed] = useState(false)

  const handleClose = () => {
    onClose()
    setIsInfoDisplayed(false)
  }

  const { RiveComponent: CoinsRive } = useRive({
    src: '/rive/coins.riv',
    autoplay: true,
    onStop: () => {
      setIsInfoDisplayed(true)
    }
  })

  return (
    <Modal isOpen={isOpen} backdrop={false} onClose={handleClose}>
      <div className="relative flex flex-col items-center pt-[200px]">
        <div className="absolute top-[-100px]">
          <div className="relative w-[915px]">
            <Image
              width={915}
              height={383}
              src={getIllustrationUrl('firework', 'webp')}
            />
            <div className="absolute -bottom-20 left-1/2 h-[500px] w-[650px] -translate-x-1/2 scale-75">
              <CoinsRive />
            </div>
          </div>
        </div>
        <div
          className={cn(
            'relative flex w-[540px] flex-col border border-[#ffd000] opacity-0 scale-50 transition-all',
            isInfoDisplayed && 'opacity-100 scale-100'
          )}>
          <div
            className="relative flex h-[43px] w-full items-center justify-center bg-[#FFD000] font-smb2 text-2xl uppercase text-black"
            style={{
              textShadow: '1.839px 0px 0px rgba(0, 0, 0, 0.25)'
            }}>
            Congrats!!!
          </div>

          <div className="relative flex w-full flex-col items-center gap-y-6 bg-black py-6">
            <div className="flex flex-col items-center gap-y-1.5">
              <span className="relative flex items-center gap-x-1.5 font-ibmb text-xl uppercase text-white">
                Your prize
                <SmileyIcon width={18} height={20} />
              </span>
              <StrokeText
                color="#FFD000"
                strokeColor="#4D2202"
                strokeWidth={6}
                className="font-smb2 text-[45px]">
                {formatNumberWithSeparator(amount)}
              </StrokeText>
            </div>
            <p className="w-[390px] text-center font-ibmr">
              The prize has been credited directly to your Available $SMILE!
              Wanna play again and win bigger?
            </p>
            <ArcadeButton
              className="h-[45px] w-[265px]"
              onClick={() => handleClose()}>
              let's go
            </ArcadeButton>

            <Image
              width={180}
              className="pointer-events-none absolute -bottom-4 left-0 aspect-[357/396]"
              src={getIllustrationUrl('locked-tokens-modal-smile', 'webp')}
            />
            <Image
              width={180}
              className="pointer-events-none absolute -bottom-4 right-0 aspect-[357/396] scale-x-[-1]"
              src={getIllustrationUrl('locked-tokens-modal-smile', 'webp')}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default CongratsModal
