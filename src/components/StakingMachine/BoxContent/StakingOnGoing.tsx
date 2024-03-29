import React, { useMemo, useState } from 'react'

import { BitJade, RightAngle } from '@/assets/icons'
import { Image } from '@/components/Image'
import { useUserStakes } from '@/hooks/useUserStakes'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { ChooseNftModal } from './ChooseNftModal'
import { StakeButton } from './StakeButton'

import { PlayerInfo } from '../Common'

export const StakingOnGoing: React.FC = () => {
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false)
  const { userStakes, jadeBalance, perAddressLimit } = useUserStakes()

  const userStakesNum = useMemo(
    () => userStakes?.length || 0,
    [userStakes?.length]
  )

  const reachingMaxStakes = useMemo(
    () => userStakesNum === perAddressLimit,
    [perAddressLimit, userStakesNum]
  )

  return (
    <>
      <ChooseNftModal
        isOpen={isChooseModalOpen}
        onClose={() => setIsChooseModalOpen(false)}
      />
      <div className="pt-4">
        <div className="mb-8 flex items-end gap-[104px]">
          <PlayerInfo />
          <div className="whitespace-nowrap font-smb text-sm">
            staking ongoing...
          </div>
          <PlayerInfo className="invisible" />
        </div>

        <div className="flex items-center justify-center gap-x-[68px]">
          <div className="flex flex-col items-center gap-y-2.5">
            <div
              className={cn('relative', {
                'pt-4': userStakesNum > 2
              })}>
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
          <div className="flex flex-col items-center">
            <div className="relative flex max-h-[169px] w-[265px] flex-col items-center justify-start gap-y-3 border-[3px] border-cyan bg-cyan/20 py-4 text-sm">
              <div className="font-smb text-sm text-cyan">REWARDS so far</div>
              <div className="flex flex-col items-center justify-center gap-1 font-psm text-cyan">
                <BitJade />
                <span className="font-bold">
                  bitJade X{jadeBalance || '???'}
                </span>
              </div>
              {!reachingMaxStakes && (
                <StakeButton onClick={() => setIsChooseModalOpen(true)}>
                  Stake more
                </StakeButton>
              )}

              <RightAngle className="absolute left-[-1px] top-[-1px] text-cyan" />
              <RightAngle className="absolute right-[-1px] top-[-1px] rotate-90 text-cyan" />
              <RightAngle className="absolute bottom-[-1px] right-[-1px] rotate-180 text-cyan" />
              <RightAngle className="absolute bottom-[-1px] left-[-1px] -rotate-90 text-cyan" />
            </div>
            {reachingMaxStakes && (
              <p className="mt-2.5 font-psm text-cyan">
                Max {perAddressLimit} NFT can be staked
              </p>
            )}
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
      <div className="absolute left-[-3px] top-[-3px] z-10 size-[9px] bg-cyan" />
      <div className="absolute right-[-3px] top-[-3px] z-10 size-[9px] bg-cyan" />
      <div className="absolute bottom-[-3px] left-[-3px] z-10 size-[9px] bg-cyan" />
      <div className="absolute bottom-[-3px] right-[-3px] z-10 size-[9px] bg-cyan" />
      <div className="absolute left-0 top-0 flex size-full items-center justify-center bg-grey3/80 text-[32px] text-cyan">
        x{num}
      </div>
    </div>
  )
}
