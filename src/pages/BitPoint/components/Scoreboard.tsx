import { SmileyIcon, Smiley3Icon, ScoreBoardIcon } from '@/assets/icons'
import { Input } from '@/components/ui/input'
import { displayAddress } from '@/utils/formatter'
import { Pagination } from './Pagination'
import { usePagination } from '@/hooks/usePagination'
import { IIndividualRank, ITeamRank, TeamService } from '@/services/team'
import { useState } from 'react'
import { cn } from '@/utils/cn'

enum ScroeTab {
  Team = 'team',
  Individual = 'individual'
}

export const ScoreBoard: React.FC = () => {
  const [tab, setTab] = useState<ScroeTab>(ScroeTab.Team)
  const isTeam = tab === ScroeTab.Team

  const {
    currentPageData,
    currentPageNum,
    hasPreviousPage,
    hasNextPage,
    fetchNextPage,
    totalPagesNum,
    fetchPreviousPage,
    setCurrentPageNum,
    setSearchValue
  } = usePagination<ITeamRank | IIndividualRank>({
    queryKey: isTeam
      ? TeamService.getTeamRank.key
      : TeamService.getUserPointRank.key,
    queryFn: isTeam
      ? TeamService.getTeamRank.call
      : TeamService.getUserPointRank.call
  })

  const handleTabChange = (tab: ScroeTab) => {
    setCurrentPageNum(1)
    setTab(tab)
  }

  return (
    <div className="relative border border-white/20 bg-black text-white">
      <div className="absolute inset-0 z-0 bg-scoreboard" />
      <div className="absolute inset-0 z-0 bg-grey8 mix-blend-hard-light" />

      <div className="relative z-10 text-white">
        <div className="flex items-center gap-x-1 px-7 pt-5">
          <ScoreBoardIcon />
          <span className="font-ppnb text-2xl text-white/50">Scoreboard</span>
        </div>

        <div className="mt-10 px-[60px] pb-6 font-ibmr text-sm">
          <div className="mb-5 flex items-center gap-x-6">
            <span
              className={cn(
                'flex items-center gap-x-1 text-white/70 cursor-pointer',
                isTeam && 'font-ibmb text-blue cursor-default',
                !isTeam && 'hover:text-white/50'
              )}
              onClick={() => handleTabChange(ScroeTab.Team)}>
              <Smiley3Icon />
              <span>Team rank</span>
            </span>
            <span
              className={cn(
                'flex items-center gap-x-1 text-white/70 cursor-pointer',
                !isTeam && 'font-ibmb text-blue cursor-default',
                isTeam && 'hover:text-white/50'
              )}
              onClick={() => handleTabChange(ScroeTab.Individual)}>
              <SmileyIcon />
              <span>Individual rank</span>
            </span>
          </div>

          <Input
            onChange={(e) => setSearchValue(e.target.value.trim())}
            placeholder="Search"
            className="w-[360px] rounded-sm border-0 bg-white/10 px-2.5 py-0.5 backdrop-blur-[2px] placeholder:text-center placeholder:text-white/20"
          />

          <div className="my-2 flex items-center justify-between text-blue">
            <span>Rank</span>
            <span>{isTeam ? 'Team' : 'User'} name</span>
            <span>bitPoint</span>
          </div>

          <div className="mb-2 h-[1px] w-full bg-blue/50 backdrop-blur-[2px]" />

          <div className="mb-9 flex flex-col gap-y-2">
            {currentPageData?.map(({ data, rank }) => (
              <div key={data.id} className="flex items-center justify-between">
                <span>#{rank}</span>
                <span>
                  {displayAddress(
                    isTeam
                      ? data.captainAddress
                      : (data as IIndividualRank).address,
                    3,
                    3
                  )}
                </span>
                <span>{data.totalPoint}</span>
              </div>
            ))}
          </div>

          <Pagination
            hasNextPage={hasNextPage}
            onClickNext={fetchNextPage}
            totalPagesNum={totalPagesNum}
            currentPageNum={currentPageNum}
            hasPreviousPage={hasPreviousPage}
            onClickPrevious={fetchPreviousPage}
            setCurrentPageNum={setCurrentPageNum}
          />
        </div>
      </div>
    </div>
  )
}
