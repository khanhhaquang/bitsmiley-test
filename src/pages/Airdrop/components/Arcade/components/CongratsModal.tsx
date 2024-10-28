import { SmileyIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { Modal } from '@/components/Modal'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

import { ArcadeButton } from './ArcadeButton'

const CongratsModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} backdrop={false} onClose={onClose}>
      <div className="relative  flex w-[540px] flex-col items-center overflow-hidden border border-[#ffd000]">
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
            <p
              className="font-smb2 text-[45px] text-[#FFD000]"
              style={{
                textShadow: '2.524px -2.524px 0px rgba(0, 0, 0, 0.25)',
                WebkitTextStrokeWidth: 2,
                WebkitTextStrokeColor: '#4D2202',
                fontVariantNumeric: 'slashed-zero'
              }}>
              {formatNumberWithSeparator(4500)}
            </p>
          </div>
          <p className="w-[390px] text-center font-ibmr">
            The prize has been credited directly to your Available $SMILE! Wanna
            play again and win bigger?
          </p>
          <ArcadeButton
            className="h-[45px] w-[265px]"
            onClick={() => onClose()}>
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
    </Modal>
  )
}

export default CongratsModal
