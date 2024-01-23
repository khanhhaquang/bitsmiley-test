import { useEffect, useRef, useState } from 'react'
import { Image } from '@/components/Image'
import { useUserInfo } from '@/hooks/useUserInfo'
import { cn } from '@/utils/cn'
import { displayAddress, getOrdScanUrl } from '@/utils/formatter'
import { getFrameUrl, getIllustrationUrl, openUrl } from '@/utils/getAssetsUrl'
import { CanvasFrames, CanvasFramesRef } from '@/components/CanvasFrames'
import { useSelector } from 'react-redux'
import { getInscriptionId } from '@/store/account/reducer'
import { useWindowSize } from '@/hooks/useWindowSize'
import { Modal } from '@/components/Modal'
import { BitDiscBlackIcon, CloseIcon } from '@/assets/icons'

export const InscriptionSucceeded: React.FC = () => {
  const { address } = useUserInfo()
  const [isPlayingCardComingout, setIsPlayingCardComingout] = useState(false)

  return (
    <>
      <div className="absolute left-[336px] top-[318px] flex flex-col gap-y-1.5 font-smb text-sm">
        <div>PLAYER:</div>
        <div>{displayAddress(address, 3, 3)}</div>
      </div>

      <Image
        src={getIllustrationUrl('disc')}
        className="absolute left-[614px] top-[337px]"
      />

      <div className="absolute left-[537px] top-[496px] text-sm">
        Your bitDisc Black is ready to be collected!
      </div>

      <div
        onClick={() => {
          if (!isPlayingCardComingout) setIsPlayingCardComingout(true)
        }}
        className={cn(
          isPlayingCardComingout && 'invisible',
          'absolute left-[613px] top-[532px] cursor-pointer z-[100]',
          'bg-white cursor-pointer text-black px-3 py-1 uppercase font-bold whitespace-nowrap text-[15px]',
          'hover:bg-blue3',
          'shadow-take-bitdisc-button hover:shadow-take-bitdisc-button-hover active:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:bg-blue'
        )}>
        take my bitdisc
      </div>

      <CardComingOut playing={isPlayingCardComingout} />
    </>
  )
}

const CardComingOut: React.FC<{ playing: boolean }> = ({ playing }) => {
  const cardComingOutRef = useRef<CanvasFramesRef>(null)
  const [isMintedModalOpen, setIsMintedModalOpen] = useState(false)
  const [playCardShine, setPlayCardShine] = useState(false)

  useEffect(() => {
    if (playing) {
      cardComingOutRef?.current?.play()
    }
  }, [playing])

  return (
    <>
      <MintedModal
        isOpen={isMintedModalOpen}
        onClose={() => setIsMintedModalOpen(false)}
      />
      {playCardShine && (
        <div className="absolute left-[1012px] top-[708px]">
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
        className={cn(
          'absolute left-0 top-0 z-50 block',
          playCardShine && 'hidden'
        )}>
        <CanvasFrames
          ref={cardComingOutRef}
          fps={10}
          autoPlay={false}
          loop={false}
          width={1423}
          height={995}
          onStop={() => setPlayCardShine(true)}
          imgLocalPaths={Array(13)
            .fill(1)
            .map((_, idx) =>
              getFrameUrl('card-coming-out', `card-coming-out-${idx + 1}`)
            )}
        />
      </div>
      <div
        className={cn(
          'group hidden absolute left-[950px] top-[806px] z-50 cursor-pointer',
          playCardShine && 'block'
        )}>
        <div className="block group-hover:hidden">
          <CanvasFrames
            fps={10}
            width={195}
            height={110}
            imgLocalPaths={Array(13)
              .fill(1)
              .map((_, idx) =>
                getFrameUrl('card-shine', `card-shine-${idx + 1}`)
              )}
          />
        </div>

        <div
          className="hidden group-hover:block"
          onClick={() => setIsMintedModalOpen(true)}>
          <Image src={getIllustrationUrl('card-hover')} />
        </div>
      </div>
    </>
  )
}

const MintedModal: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const inscriptionId = useSelector(getInscriptionId)
  const { width } = useWindowSize()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex h-full w-full items-center justify-center bg-black2/80 text-white">
        <div
          className="relative border border-white bg-black"
          style={{
            scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
          }}>
          <CloseIcon
            onClick={onClose}
            className="absolute right-2.5 top-2.5 z-[100] cursor-pointer"
          />

          <div className="flex flex-col items-center justify-center gap-y-6 bg-black bg-mint-success-modal bg-cover bg-no-repeat px-[42px] pb-6 pt-[42px]">
            <div className="font-smb text-[28px]">CONGRATULATIONS</div>

            <div className="flex flex-col items-center justify-center">
              <Image
                src={getIllustrationUrl('bit-disk')}
                className="w-[333px]"
              />
              <BitDiscBlackIcon />
            </div>

            <div className="w-[439px] text-center text-sm">
              You are now the proud owner of bitDisc BLACK as a status of true
              bitSmiley OG. You can find the on-chain version in your wallet{' '}
              {!!inscriptionId && (
                <span className="cursor-pointer text-green">
                  (
                  <span
                    onClick={() => openUrl(getOrdScanUrl(inscriptionId))}
                    className="hover:underline">
                    ORDSCAN
                  </span>
                  )
                </span>
              )}
            </div>

            <div
              onClick={onClose}
              className={cn(
                'relative inline-block bg-white cursor-pointer text-black px-3 py-1 font-bold whitespace-nowrap text-[15px] hover:bg-blue3',
                'shadow-take-bitdisc-button hover:shadow-take-bitdisc-button-hover active:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:bg-blue'
              )}>
              Confirm
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
