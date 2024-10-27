import { SmileyIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ArcadeButton } from './ArcadeButton'

const LockedTokensModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} backdrop={false} onClose={onClose}>
      <div className="flex  w-[540px] flex-col items-center border border-[#ffd000]">
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
                src={getIllustrationUrl('locked-tokens-modal-value-bg', 'webp')}
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
                src={getIllustrationUrl('locked-tokens-modal-value-bg', 'webp')}
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
            You didn’t lose your $SMILE, we only locked it. Try your better luck
            this time?
          </p>
          <ArcadeButton
            className="h-[45px] w-[265px]"
            onClick={() => onClose()}>
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
    </Modal>
  )
}

export default LockedTokensModal
