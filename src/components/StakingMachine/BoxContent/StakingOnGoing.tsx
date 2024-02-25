import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { PlayerInfo } from '../Common'
import { Image } from '@/components/Image'
import { useUserInfo } from '@/hooks/useUserInfo'
import { BitJade, RightAngle } from '@/assets/icons'
import { useReadStakingContractGetStakeRewards } from '@/contracts/Staking'
import { Button } from '@/components/Button'
import { ChooseNftModal } from './ChooseNftModal'
import { useState } from 'react'

export const StakingOnGoing: React.FC = () => {
  const [isChooseModalOpen, setIsChooseModalOpen] = useState(false)

  const { address } = useUserInfo()
  const { data: stakes } = useReadStakingContractGetStakeRewards({
    args: [address]
  })

  const total = stakes?.reduce(
    (pre, cur) => (pre += Number(cur.reward || 0)),
    0
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
          <div className="whitespace-nowrap font-smb">staking ongoing...</div>
          <PlayerInfo className="invisible" />
        </div>

        <div className="flex items-center justify-center gap-x-[68px]">
          <div className="flex flex-col items-center gap-y-2.5">
            <div className="relative h-[125px] w-[129px] border-[3px] border-cyan">
              <Image src={getIllustrationUrl('bit-mint', 'webp')} />
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-black/50 text-[32px] text-cyan">
                x{stakes?.length || 0}
              </div>
            </div>
            <div className="text-base text-cyan">M-bitDisc-Black</div>
          </div>
          <div className="relative flex h-[169px] w-[265px] flex-col items-center justify-between border-[3px] border-cyan bg-cyan/20 py-[25px] text-sm">
            <div className="font-smb text-[21px] text-cyan">REWARDS</div>
            <div className="flex items-center justify-center gap-x-2 font-smb text-xs text-cyan">
              <span>BITJADE</span>
              <BitJade />
              <span>X{total || '???'}</span>
            </div>
            <Button
              size="xs"
              onClick={() => setIsChooseModalOpen(true)}
              className="w-[120px] bg-green2 shadow-stake-now-button">
              Stake now
            </Button>

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
