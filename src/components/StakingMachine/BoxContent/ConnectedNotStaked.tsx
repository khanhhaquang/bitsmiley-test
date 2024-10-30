import { useState } from 'react'

import { BitJade, RightAngle } from '@/assets/icons'
import { Image } from '@/components/Image'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ChooseNftModal } from './ChooseNftModal'
import { StakeButton } from './StakeButton'

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
          <p>Stake until TGE, receive special rewards</p>
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
          <RightAngle className="absolute left-[-1px] top-[-1px] text-cyan" />
          <RightAngle className="absolute right-[-1px] top-[-1px] rotate-90 text-cyan" />
          <RightAngle className="absolute bottom-[-1px] right-[-1px] rotate-180 text-cyan" />
          <RightAngle className="absolute bottom-[-1px] left-[-1px] -rotate-90 text-cyan" />
        </div>
      </div>
    </>
  )
}
