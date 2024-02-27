import { BitJade, RightAngle } from '@/assets/icons'
import { useState } from 'react'
import { ChooseNftModal } from './ChooseNftModal'
import { StakeButton } from './StakeButton'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

export const ConnectedNotStaked: React.FC = () => {
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false)

  return (
    <>
      <ChooseNftModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
      />
      <div className="flex items-center justify-center gap-x-[83px] pt-16">
        <div className="flex h-full w-[288px] flex-col items-center gap-y-4 text-sm">
          <p className="text-nowrap font-smb text-cyan">bitjade staking</p>
          <p>
            Stake until TGE, receive special rewards (limited seats available)
          </p>
          <Image
            src={getIllustrationUrl('discjadecoins')}
            alt="Disc jade"
            width={117}
            height={110}
          />
        </div>

        <div className="relative flex h-[177px] w-[265px] flex-col items-center justify-between border-[3px] border-cyan bg-cyan/20 py-[25px] text-sm">
          <div className="font-smb text-[21px] text-cyan">REWARDS</div>
          <div className="flex items-center justify-center gap-x-2 font-smb text-xs text-cyan">
            <span>BITJADE</span>
            <BitJade />
            <span>X???</span>
          </div>
          <StakeButton onClick={() => setIsChooseModalOpen(true)} />
          <RightAngle className="absolute left-0 top-0 text-green2" />
          <RightAngle className="absolute right-0 top-0 rotate-90 text-green2" />
          <RightAngle className="absolute bottom-0 right-0 rotate-180 text-green2" />
          <RightAngle className="absolute bottom-0 left-0 -rotate-90 text-green2" />
        </div>
      </div>
    </>
  )
}
