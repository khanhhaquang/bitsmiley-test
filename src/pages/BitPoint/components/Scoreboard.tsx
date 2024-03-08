import { SearchInput } from './SearchInput'
import { SmileyIcon, Smiley3Icon, ScoreBoardIcon } from '@/assets/icons'
import { displayAddress } from '@/utils/formatter'
import { Pagination } from './Pagination'
import { usePagination } from '@/hooks/usePagination'
import { IIndividualRank, ITeamRank, TeamService } from '@/services/team'
import { useState } from 'react'
import { cn } from '@/utils/cn'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

enum ScoreTab {
  Team = 'team',
  Individual = 'individual'
}

export const ScoreBoard: React.FC = () => {
  const [tab, setTab] = useState<ScoreTab>(ScoreTab.Team)
  const isTeam = tab === ScoreTab.Team

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
  } = usePagination<[ITeamRank, number] | [IIndividualRank, number]>({
    queryKey: isTeam
      ? [TeamService.getTeamRank.key]
      : [TeamService.getUserPointRank.key],
    queryFn: isTeam
      ? TeamService.getTeamRank.call
      : TeamService.getUserPointRank.call
  })

  const handleTabChange = (tab: ScoreTab) => {
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
              onClick={() => handleTabChange(ScoreTab.Team)}>
              <Smiley3Icon />
              <span>Team rank</span>
            </span>
            <span
              className={cn(
                'flex items-center gap-x-1 text-white/70 cursor-pointer',
                !isTeam && 'font-ibmb text-blue cursor-default',
                isTeam && 'hover:text-white/50'
              )}
              onClick={() => handleTabChange(ScoreTab.Individual)}>
              <SmileyIcon />
              <span>Individual rank</span>
            </span>
          </div>

          <SearchInput onChange={setSearchValue} />

          <Table className="mb-9">
            <TableHeader className="text-blue [&_tr]:border-blue/50">
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>{isTeam ? 'Team' : 'User'} name</TableHead>
                <TableHead>bitPoint</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData?.map(([data, rank]) => (
                <TableRow key={data.id}>
                  <TableCell className="font-medium">#{rank}</TableCell>
                  <TableCell>
                    {displayAddress(
                      isTeam
                        ? data.captainAddress
                        : (data as IIndividualRank).address,
                      3,
                      3
                    )}
                  </TableCell>
                  <TableCell>{data.totalPoint}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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
