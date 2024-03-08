import { CopyIcon, LevelIcon, PeopleIcon } from '@/assets/icons'
import { cn } from '@/utils/cn'

const YourTeam: React.FC = () => {
  return (
    <div
      className={cn(
        'border border-green/30 relative w-[515px] bg-black',
        'py-7 px-6'
      )}>
      <div className="absolute inset-0 z-0 bg-bitpointPointBg" />
      <div className="absolute inset-0 z-0 bg-green5 mix-blend-hard-light" />

      <div className="relative z-10 flex flex-col text-white">
        <div className="flex items-center justify-between">
          <span className="font-ppnb text-4xl text-green/40">Your team</span>
          <span className="flex items-center justify-between gap-x-1">
            <PeopleIcon />
            <span className="font-ibmr text-sm text-white/70">242</span>
          </span>
        </div>

        <div className="mb-11 mt-3 flex items-center gap-x-1.5">
          <span className="font-ppnb text-5xl">45j1425D</span>
          <CopyIcon />
        </div>

        <div className="flex items-center gap-x-9">
          <div className="flex flex-col gap-y-1">
            <div className="font-ibmr text-sm text-white/70">Rank</div>
            <div className="flex items-end">
              <span className="font-ppnb text-5xl">443</span>
              <span className="font-ppnb text-2xl text-white/50">/3948</span>
            </div>
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="font-ibmr text-sm text-white/70">Team bitPoint</div>
            <div className="font-ppnb text-5xl">4930</div>
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="font-ibmr text-sm text-white/70">Level ⓘ</div>
            <div className="flex items-center gap-x-2">
              <LevelIcon />
              <LevelIcon />
              <LevelIcon />
              <LevelIcon />
              <LevelIcon />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default YourTeam
