import { Image } from '@/components/Image'
import { useEffect, useRef, useState } from 'react'
import { CanvasFrames, CanvasFramesRef } from '@/components/CanvasFrames'
import { cn } from '@/utils/cn'
import { getFrameUrl, getIllustrationUrl } from '@/utils/getAssetsUrl'
import { CloseIcon, DotIcon, LineIcon, StarIcon } from '@/assets/icons'
import { Modal } from '@/components/Modal'

export const CardComingOut: React.FC<{ playing: boolean }> = ({ playing }) => {
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
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex h-full w-full items-center justify-center bg-black2/80 text-white">
        <div className="relative border-2 border-white bg-black">
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
                src={getIllustrationUrl('black-card')}
                className="mb-9 h-[203px] w-[320px]"
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
                <span className="cursor-pointer hover:underline">btcscan</span>]
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
