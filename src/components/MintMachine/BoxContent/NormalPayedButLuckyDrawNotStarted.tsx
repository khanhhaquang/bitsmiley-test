import { OvalCoinBlueIcon } from '@/assets/icons'
import { CanvasFrames } from '@/components/CanvasFrames'
import { getFrameUrl } from '@/utils/getAssetsUrl'

export const NormalPayedButLuckyDrawNotStarted: React.FC = () => {
  return (
    <>
      <div className="absolute left-[336px] top-[325px] flex w-[720px] items-center justify-between font-smb text-sm">
        <div className="flex flex-col items-start gap-y-1.5">
          <div>Player:</div>
          <div>39s...sda</div>
        </div>

        <div className="flex flex-col items-end gap-y-1.5">
          <div>BITGEM GOLD</div>
          <div className="flex items-center gap-x-1">
            <OvalCoinBlueIcon />
            <OvalCoinBlueIcon />
          </div>
        </div>
      </div>

      <div className="absolute left-[497px] top-[409px] flex w-[398px] flex-col items-center">
        <div className="mb-5 font-smb text-sm">The grand minting is here!</div>
        <div className="text-center text-sm leading-tight">
          Click on the number pad below to run this minting machine. You have
          chance to win 1 of the 1500 bitSmiley cards. Max 1 win for each
          wallet. If you didn’t win anything after all, we will refund your
          bitGem money.
        </div>
      </div>

      <div className="absolute left-[336px] top-[419px]">
        <CanvasFrames
          fps={5}
          width={92}
          height={100}
          imgLocalPaths={Array(4)
            .fill(1)
            .map((_, idx) => getFrameUrl('dice', `dice-${idx + 1}`, 'svg'))}
        />
      </div>

      <div className="absolute left-[962px] top-[419px]">
        <CanvasFrames
          fps={5}
          width={92}
          height={100}
          imgLocalPaths={Array(4)
            .fill(1)
            .map((_, idx) => getFrameUrl('dice', `dice-${idx + 1}`, 'svg'))}
        />
      </div>
    </>
  )
}
