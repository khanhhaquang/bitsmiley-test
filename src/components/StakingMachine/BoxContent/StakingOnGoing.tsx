import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { PlayerInfo } from '../Common'
import { Image } from '@/components/Image'
import { BitJade, RightAngle } from '@/assets/icons'
import { ChooseNftModal } from './ChooseNftModal'
import React, { useState } from 'react'
import { StakeButton } from './StakeButton'

import useUserStakes from '@/hooks/useUserStakes'
import { cn } from '@/utils/cn'

export const StakingOnGoing: React.FC = () => {
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false)
  const { userStakes, jadeBalance } = useUserStakes()

  const userStakesNum = userStakes?.length || 0

  return (
    <>
      <ChooseNftModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
      />
      <div className="pt-4">
        <div className="mb-8 flex items-end gap-[104px]">
          <PlayerInfo />
          <div className="whitespace-nowrap font-smb">staking ongoing...</div>
          <PlayerInfo className="invisible" />
        </div>

        <div className="flex items-center justify-center gap-x-[68px]">
          <div className="flex flex-col items-center gap-y-2.5">
            <div className="relative">
              <MBitdiscBlack num={userStakesNum} />
              {userStakesNum > 1 && (
                <MBitdiscBlack
                  num={userStakesNum}
                  className="absolute bottom-[9px] left-[9px] z-0 opacity-50"
                />
              )}
              {userStakesNum > 2 && (
                <MBitdiscBlack
                  num={userStakesNum}
                  className="absolute bottom-[18px] left-[18px] z-0 opacity-20"
                />
              )}
            </div>
            <div className="text-base text-cyan">M-bitDisc-Black</div>
          </div>
          <div className="relative flex h-[169px] w-[265px] flex-col items-center justify-between border-[3px] border-cyan bg-cyan/20 py-[25px] text-sm">
            <div className="font-smb text-[21px] text-cyan">REWARDS</div>
            <div className="flex items-center justify-center gap-x-2 font-smb text-xs text-cyan">
              <span>BITJADE</span>
              <BitJade />
              <span>X{jadeBalance || '???'}</span>
            </div>
            <StakeButton onClick={() => setIsChooseModalOpen(true)}>
              Stake more
            </StakeButton>

            <RightAngle className="absolute left-0 top-0 text-green2" />
            <RightAngle className="absolute right-0 top-0 rotate-90 text-green2" />
            <RightAngle className="absolute bottom-0 right-0 rotate-180 text-green2" />
            <RightAngle className="absolute bottom-0 left-0 -rotate-90 text-green2" />
          </div>
        </div>
      </div>
    </>
  )
}

const MBitdiscBlack: React.FC<{ num: number; className?: string }> = ({
  num,
  className
}) => {
  return (
    <div
      className={cn(
        'relative h-[125px] w-[129px] border-[3px] border-cyan z-10',
        className
      )}>
      <Image src={getIllustrationUrl('bit-mint', 'webp')} />
      <div className="absolute left-[-3px] top-[-3px] z-10 h-[9px] w-[9px] bg-cyan" />
      <div className="absolute right-[-3px] top-[-3px] z-10 h-[9px] w-[9px] bg-cyan" />
      <div className="absolute bottom-[-3px] left-[-3px] z-10 h-[9px] w-[9px] bg-cyan" />
      <div className="absolute bottom-[-3px] right-[-3px] z-10 h-[9px] w-[9px] bg-cyan" />
      <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-grey3/80 text-[32px] text-cyan">
        x{num}
      </div>
    </div>
  )
}
