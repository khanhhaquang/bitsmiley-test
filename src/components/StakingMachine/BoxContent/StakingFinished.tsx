import { BitJade, RightAngle } from '@/assets/icons'
import { Button } from '@/components/Button'
import { Image } from '@/components/Image'
import { useUserStakes } from '@/hooks/useUserStakes'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { PlayerInfo } from '../Common'

export const StakingFinished: React.FC = () => {
  const { jadeBalance, handleWithdraw, isClaiming, userStakes } =
    useUserStakes()

  return (
    <div className="pt-4">
      <div className="mb-10 flex items-end gap-[104px]">
        <PlayerInfo />
        <div className="whitespace-nowrap font-smb">Staking Finished</div>
        <PlayerInfo className="invisible" />
      </div>

      <div className="flex w-full items-start justify-center gap-x-6">
        <div className="relative aspect-square w-[163px]">
          <Image
            src={getIllustrationUrl('bit-mint', 'webp')}
            className="border-[3px] border-white"
          />
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <Button
              size="xs"
              className="w-[100px]"
              onClick={() => handleWithdraw()}
              disabled={isClaiming || !userStakes?.length}>
              {isClaiming ? 'Retrieving' : 'Retrieve'}
            </Button>
          </div>
          <div className="absolute left-0 top-0 size-full bg-black/50"></div>
        </div>

        <div className="relative flex h-[163px] w-[311px] flex-col items-center justify-between bg-cyan px-6 pb-6 pt-4 text-sm">
          <div className="flex items-center gap-x-3 font-smb text-base text-black">
            <BitJade />
            bitjade X{jadeBalance}
          </div>

          <div className="text-center text-[15px] text-black">
            All the bitJade is awarded to your record. Retrieve your NFT before
            you can join future staking.
          </div>

          <RightAngle className="absolute left-0 top-0 text-black" />
          <RightAngle className="absolute right-0 top-0 rotate-90 text-black" />
          <RightAngle className="absolute bottom-0 right-0 rotate-180 text-black" />
          <RightAngle className="absolute bottom-0 left-0 -rotate-90 text-black" />
        </div>
      </div>
    </div>
  )
}
