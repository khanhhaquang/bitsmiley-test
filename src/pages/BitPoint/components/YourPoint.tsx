import {
  ArrowTopRightIcon,
  BugIcon,
  HistoryPointIcon,
  YourPointHeaderIcon
} from '@/assets/icons'
import { useUserPoint } from '@/hooks/useUserPoint'
import { cn } from '@/utils/cn'

type YourPointProps = {
  className?: string
}

const YourPoint: React.FC<YourPointProps> = ({ className }) => {
  const { userPoint } = useUserPoint()

  return (
    <div
      className={cn(
        'border border-blue5 relative w-[515px] bg-black overflow-hidden',
        'py-7 px-6',
        className
      )}>
      <div className="absolute inset-0 z-0 bg-bitpointPointBg" />
      <div className="absolute inset-0 z-0 bg-blue4 mix-blend-hard-light" />
      <div className="relative z-10 flex flex-col">
        <h2 className="mb-6 flex items-center gap-1 font-ppnb text-4xl text-blue">
          <YourPointHeaderIcon />
          Your bitPoint
        </h2>

        <div className="flex justify-between">
          <p className="flex flex-col items-start">
            <span className="font-ibmr text-sm text-white/70">Total</span>
            <span className="font-ppnb text-6xl text-white">
              {userPoint?.totalPoint}
            </span>
          </p>

          <p className="relative flex min-w-[121px] flex-col items-start">
            <a className="absolute right-1 top-1 text-green">
              <ArrowTopRightIcon />
            </a>
            <span className="font-ibmr text-sm text-white/70">Rank</span>
            <p className="font-ppnb text-6xl text-white">
              {userPoint?.rank}
              <span className="text-2xl text-white/50">
                /{userPoint?.userTotal}
              </span>
            </p>
          </p>
        </div>

        <p className="flex items-center gap-x-3 text-green">
          <span className="font-ibmb text-2xl">
            +{userPoint?.yesterdayPoint}
          </span>
          <span className="w-20 font-ibmr text-xs">from yesterday</span>
        </p>

        <div className="mb-4 mt-5 h-[1px] w-full bg-[rgba(38,72,239,0.60)]" />

        <div className="flex justify-between">
          <div className="flex flex-col items-start gap-y-2">
            <span className="font-ibmr text-sm text-white/70">Boost</span>
            <div className="flex gap-x-4">
              <div className="relative flex h-16 w-[96px] flex-col items-start justify-between rounded-sm bg-yourPointStats px-3 py-1.5">
                <BugIcon className="absolute right-2 top-1/2 z-0 -translate-y-1/2" />
                <span className="relative font-ibmr text-sm text-white">
                  Team ⓘ
                </span>
                <span className="relative font-ppnb text-2xl text-green">
                  +{userPoint?.teamAddition}%
                </span>
              </div>

              <div className="relative flex h-[76px] w-[106px] flex-col items-start justify-between rounded-sm bg-yourPointStats px-3 py-1.5">
                <BugIcon className="absolute right-2 top-1/2 z-0 -translate-y-1/2 scale-125" />
                <span className="relative font-ibmr text-sm text-white">
                  bitDisk ⓘ
                </span>
                <span className="relative font-ppnb text-2xl text-green">
                  +{userPoint?.bitDisc}%
                </span>
              </div>
            </div>
          </div>

          <p className="relative flex flex-col items-center gap-y-[18px]">
            <span className="font-ibmr text-sm text-white/70">History</span>
            <a className="text-white">
              <HistoryPointIcon />
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default YourPoint
