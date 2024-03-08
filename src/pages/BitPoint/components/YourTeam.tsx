import { cn } from '@/utils/cn'
import { LevelIcon, PeopleIcon } from '@/assets/icons'
import { CopyButton } from '@/components/CopyButton'
import { useTeamInfo } from '@/hooks/useTeamInfo'

const YourTeam: React.FC = () => {
  const { myTeamInfo } = useTeamInfo()

  if (!myTeamInfo) return null

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
            <span className="font-ibmr text-sm text-white/70">
              {myTeamInfo.teamMemberTotal}
            </span>
          </span>
        </div>

        <div className="mb-11 mt-3 flex items-center gap-x-1.5">
          <span className="font-ppnb text-5xl">
            {myTeamInfo.invitationCode}
          </span>
          <CopyButton
            text={myTeamInfo.invitationCode}
            className="text-white hover:text-white/50"
          />
        </div>

        <div className="flex items-start gap-x-9">
          <div className="flex flex-col gap-y-1">
            <div className="font-ibmr text-sm text-white/70">Rank</div>
            <div className="flex items-end">
              <span className="font-ppnb text-5xl">{myTeamInfo.rank}</span>
              <span className="font-ppnb text-2xl text-white/50">
                /{myTeamInfo.teamTotal}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-y-1">
            <div className="font-ibmr text-sm text-white/70">Team bitPoint</div>
            <div className="font-ppnb text-5xl">{myTeamInfo.totalPoint}</div>
          </div>

          {!!myTeamInfo.level && (
            <div className="flex flex-col gap-y-2">
              <div className="font-ibmr text-sm text-white/70">Level ⓘ</div>
              <div className="flex items-center gap-x-2">
                {Array(myTeamInfo.level).map((_, idx) => (
                  <LevelIcon key={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default YourTeam
