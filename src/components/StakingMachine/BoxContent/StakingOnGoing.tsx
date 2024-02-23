import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { PlayerInfo } from '../Common'
import { Image } from '@/components/Image'
import { BitJadeBlack, RightAngle } from '@/assets/icons'

export const StakingOnGoing: React.FC = () => {
  return (
    <div className="pt-4">
      <div className="mb-14 flex items-end gap-[104px]">
        <PlayerInfo />
        <div className="whitespace-nowrap font-smb">staking ongoing...</div>
        <PlayerInfo className="invisible" />
      </div>
      <div className="flex w-full items-start justify-center gap-x-6">
        <Image src={getIllustrationUrl('locked-bitdisc')} />
        <div className="relative flex h-[125px] w-[216px] flex-col items-center justify-between bg-cyan pb-3 pt-1.5 text-sm">
          <div className="text-black">Rewards so far</div>
          <div className="flex flex-col items-center gap-y-3">
            <BitJadeBlack />
            <div className="font-smb text-base text-black">BITJADE X54</div>
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
