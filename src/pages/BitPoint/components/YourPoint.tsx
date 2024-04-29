import { Link } from 'react-router-dom'

import { HistoryPointIcon } from '@/assets/icons'
import { Image } from '@/components/Image'
import { InfoIndicator } from '@/components/InfoIndicator'
import { useUserPoint } from '@/hooks/useUserPoint'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'
import { formatNumberWithSeparator } from '@/utils/number'

import { BitPointBoardContainer } from './BitPointBoardContainer'

export const YourPoint: React.FC = () => {
  const { userPoint } = useUserPoint()
  const { totalPoint, yesterdayPoint, rank, userTotal, teamAddition, bitDisc } =
    userPoint || {}

  return (
    <BitPointBoardContainer
      title="Your bitPoint"
      titleClassName="bg-blue"
      containerClassName="border-blue/60">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 text-sm text-blue">
          <div className="h-[1px] flex-1 bg-blue" />
          <div className="font-ibmb">Total</div>
          <div className="h-[1px] flex-1 bg-blue" />
        </div>
        <div className="flex flex-col items-center justify-center gap-y-2 font-smb text-lg">
          <div>{formatNumberWithSeparator(totalPoint || 0)}</div>
          <div className="font-ibmb text-xs text-green">
            +{formatNumberWithSeparator(yesterdayPoint || 0)} from yesterday
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 pb-3">
        <div className="flex items-center gap-x-2 text-sm text-blue">
          <div className="h-[1px] flex-1 bg-blue" />
          <div className="font-ibmb">Rank</div>
          <div className="h-[1px] flex-1 bg-blue" />
        </div>
        <div className="flex items-end justify-center font-smb">
          <span className="text-lg">
            {formatNumberWithSeparator(rank || 0)}/
          </span>
          <span className="text-[8px] text-white/50">
            {formatNumberWithSeparator(userTotal || 0)}
          </span>
        </div>
      </div>

      <div>
        <div className="h-[1px] w-full bg-blue" />
        <div className="flex items-start justify-between">
          <div className="flex gap-x-2 pt-2.5">
            <span>
              <div className="relative flex flex-col gap-y-0.5 bg-blue p-1 pr-4 font-ibmr text-sm font-bold text-black">
                <span className="relative z-10 font-ibmb">Boost</span>
                <span className="relative z-10">
                  Team <InfoIndicator message="team" />
                </span>

                <Image
                  className="absolute left-0 top-0 size-full"
                  src={getIllustrationUrl('bitpoint-yourteam-boost-bg')}
                />
              </div>
              <div className="w-full bg-blue/20 px-1.5 py-0.5 font-ibmr font-bold text-blue">
                +{Number(teamAddition) * 100}%
              </div>
            </span>

            <span>
              <div className="relative flex flex-col gap-y-0.5 bg-blue p-1 pr-4 font-ibmr text-sm font-bold text-black">
                <span className="relative z-10 font-ibmb">Boost</span>
                <span className="relative z-10">
                  bitDisk <InfoIndicator message="bitDisk" />
                </span>

                <Image
                  className="absolute left-0 top-0 size-full"
                  src={getIllustrationUrl('bitpoint-yourteam-boost-bg')}
                />
              </div>
              <div className="w-full bg-blue/20 px-1.5 py-0.5 font-ibmr font-bold text-blue">
                +{Number(bitDisc) * 100}%
              </div>
            </span>
          </div>

          <div className="border-l border-blue px-2 pb-2.5 pt-1">
            <div className="group flex h-full flex-col items-center gap-y-1 px-0.5 py-1 pl-[7px] text-sm text-blue">
              <div>History</div>
              <Link
                to="./history"
                className="group-hover:text-blue1 group-active:text-blue/60">
                <HistoryPointIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BitPointBoardContainer>
  )
}
