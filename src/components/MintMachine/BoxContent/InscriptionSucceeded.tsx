import { useEffect, useRef, useState } from 'react'
import { Image } from '@/components/Image'
import { useUserInfo } from '@/hooks/useUserInfo'
import { cn } from '@/utils/cn'
import { displayAddress, getBtcScanUrl } from '@/utils/formatter'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getAssetsUrl'
import { CanvasFrames, CanvasFramesRef } from '@/components/CanvasFrames'
import { useSelector } from 'react-redux'
import { getTxId } from '@/store/account/reducer'
import { useWindowSize } from '@/hooks/useWindowSize'
import { Modal } from '@/components/Modal'
import { CloseIcon, DotIcon, LineIcon, StarIcon } from '@/assets/icons'

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
          'shadow-take-bitdisc-button hover:shadow-take-bitdisc-button-hover active:shadow-none active:translate-x-1.5 active:translate-y-1.5 active:bg-blue'
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
  const txId = useSelector(getTxId)
  const { width } = useWindowSize()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex h-full w-full items-center justify-center bg-black2/80 text-white">
        <div
          className="relative border-2 border-white bg-black"
          style={{
            scale: `${width >= 1920 ? 100 : (width * 100) / 1920}%`
          }}>
          <CloseIcon
            onClick={onClose}
            className="absolute right-2.5 top-2.5 z-[100] cursor-pointer"
          />

          <div className="px-[72px] pb-14 pt-[72px]">
            <div className="mb-9 flex items-center justify-between">
              <StarIcon className="mr-3 h-[29px] w-5" />
              <StarIcon className="h-[29px] w-5" />
              <span className="mx-[18px] font-smb text-[28px]">
                CONGRATULATIONS
              </span>
              <StarIcon className="h-[29px] w-5" />
              <StarIcon className="ml-3 h-[29px] w-5" />
            </div>
            <div className="mb-[72px] flex flex-col items-center">
              <Image
                src={getIllustrationUrl('disc')}
                className="mb-9 h-[203px] object-cover mix-blend-lighten"
              />
              <div className="flex flex-col items-center gap-y-2.5">
                <div className="bg-express-black bg-clip-text font-smb text-lg text-transparent">
                  SMILEY EXPRESS BLACK
                </div>
                <div className="relative h-[14px] w-[88px]">
                  <span className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap bg-black px-1.5">
                    <span className="bg-express-black bg-clip-text text-lg text-transparent">
                      bitSmiler OG
                    </span>
                  </span>
                  <LineIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>
            <div className="mb-6 w-[528px] text-sm leading-tight">
              You are now the proud owner of SMILEY EXPRESS BLACK card. For you,
              one of the bitSmiler OG, we have a lot of exciting bits ahead for
              you.
            </div>
            <div className="mb-9 flex items-center gap-x-2 uppercase text-green">
              <DotIcon />
              <span>
                your card is on the way [
                <span
                  className="cursor-pointer hover:underline"
                  onClick={() => {
                    if (!txId) return
                    window.open(getBtcScanUrl(txId), '__blank')
                  }}>
                  btcscan
                </span>
                ]
              </span>
            </div>

            <div className="flex items-center justify-center">
              <div
                onClick={onClose}
                className={cn(
                  'relative inline-block bg-white cursor-pointer text-black px-5 py-2 font-bold whitespace-nowrap text-[15px] hover:bg-blue3',
                  'shadow-connectwallet-button hover:shadow-connectwallet-button-hover active:shadow-none active:translate-x-1.5 active:translate-y-1.5 active:bg-blue'
                )}>
                CONFIRM
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
