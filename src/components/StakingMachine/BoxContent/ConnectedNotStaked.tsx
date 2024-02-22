import { BitJade, CloseIcon, RightAngle } from '@/assets/icons'
import { Image } from '@/components/Image'
import { Button } from '@/components/Button'
import { Modal } from '@/components/Modal'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { useState } from 'react'

export const ConnectedNotStaked: React.FC = () => {
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false)

  return (
    <>
      <ChooseNftModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
      />
      <div className="absolute left-1/2 top-[362px] flex -translate-x-1/2 items-center justify-center gap-x-[83px]">
        <div className="flex h-full w-[288px] flex-col items-center gap-y-4 text-sm">
          <div className="text-nowrap font-smb text-cyan">
            Limited edition staking
          </div>
          <div>
            Stake until TGE, receive special rewards (limited seats available)
          </div>
          <div className="mt-3 flex items-center justify-center gap-x-2">
            <span className="text-[28px] font-semibold text-warning">
              30/100
            </span>
            <span className="text-[15px]">left</span>
          </div>
        </div>

        <div className="relative flex h-[177px] w-[265px] flex-col items-center justify-between border-[3px] border-cyan bg-cyan/20 py-[25px] text-sm">
          <div className="font-smb text-[21px] text-cyan">REWARDS</div>
          <div className="flex items-center justify-center gap-x-2 font-smb text-xs text-cyan">
            <span>BITJADE</span>
            <BitJade />
            <span>X???</span>
          </div>
          <Button
            size="xs"
            className="w-[120px] bg-green2 shadow-stake-now-button"
            onClick={() => setIsChooseModalOpen(true)}>
            Stake now
          </Button>

          <RightAngle className="absolute left-0 top-0" />
          <RightAngle className="absolute right-0 top-0 rotate-90" />
          <RightAngle className="absolute bottom-0 right-0 rotate-180" />
          <RightAngle className="absolute bottom-0 left-0 -rotate-90" />
        </div>
      </div>
    </>
  )
}

const ChooseNftModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const [selected, setSelected] = useState(0)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative border-2 border-black bg-black bg-connect-modal bg-cover bg-no-repeat font-smb text-2xl">
        <CloseIcon
          onClick={onClose}
          className="absolute right-6 top-6 cursor-pointer"
        />
        <div className="flex flex-col items-center p-11">
          <div className="mb-8 whitespace-nowrap">Choose one NFT to stake</div>
          <div className="grid max-h-[345px] grid-cols-3 gap-5 overflow-y-scroll border border-dashed border-white/50 p-6">
            {Array(5)
              .fill(1)
              .map((_, index) => (
                <div
                  key={index}
                  onClick={() => setSelected(index)}
                  className="flex cursor-pointer flex-col items-center gap-y-1.5">
                  <Image
                    src={getIllustrationUrl('bit-mint', 'webp')}
                    className={cn(
                      'h-[203px] w-[207px]',
                      index === selected && 'border-4 border-white'
                    )}
                  />
                  <div className="font-psm text-sm">bitDisc-black #1923</div>
                </div>
              ))}
          </div>
          <div className="my-8 font-psm text-sm">
            Each wallet can select one NFT to stake.
          </div>
          <Button size="xs" className="w-[120px] font-psm text-sm">
            Proceed
          </Button>
        </div>
      </div>
    </Modal>
  )
}
