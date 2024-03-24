import { useState } from 'react'

import { InputIndicatorIcon } from '@/assets/icons'
import { Pagination } from '@/components/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { usePagination } from '@/hooks/usePagination'
import { IIndividualRank, ITeamRank, TeamService } from '@/services/team'
import { cn } from '@/utils/cn'
import { displayAddress } from '@/utils/formatter'
import { formatNumberWithSeparator } from '@/utils/number'

import { BitPointBoardContainer } from './BitPointBoardContainer'
import { SearchInput } from './SearchInput'

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
    <BitPointBoardContainer
      title="ScoreBoard"
      titleClassName="bg-white/50"
      containerClassName="bg-black/30 border-white/50">
      <div className="flex items-center gap-x-2">
        <span
          className={cn(
            'flex items-center gap-x-1 text-white/50 text-sm bg-white/10 cursor-pointer px-2 py-1',
            isTeam && 'font-ibmb text-black cursor-default bg-white/50',
            !isTeam && 'hover:bg-white/20'
          )}
          onClick={() => handleTabChange(ScoreTab.Team)}>
          <InputIndicatorIcon
            className={cn('transition-all', isTeam && 'rotate-90')}
          />
          <span>Team rank</span>
        </span>
        <span
          className={cn(
            'flex items-center gap-x-1 text-white/50 text-sm bg-white/10 cursor-pointer px-2 py-1',
            !isTeam && 'font-ibmb text-black cursor-default bg-white/50',
            isTeam && 'hover:bg-white/20'
          )}
          onClick={() => handleTabChange(ScoreTab.Individual)}>
          <InputIndicatorIcon
            className={cn('transition-all', !isTeam && 'rotate-90')}
          />
          <span>Individual</span>
        </span>
      </div>

      <div>
        <SearchInput onChange={setSearchValue} />
        <Table className="font-ibmr text-xs">
          <TableHeader className="mb-0 text-white/50 [&_tr]:mb-0 [&_tr]:border-white/20">
            <TableRow className="[&_th]:px-3 [&_th]:py-1">
              <TableHead>Rank</TableHead>
              <TableHead className="translate-x-1">
                {isTeam ? 'Team name' : 'User address'}
              </TableHead>
              <TableHead>bitPoint</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData?.map(([data, rank], index) => (
              <TableRow
                key={data.id}
                className={cn(
                  '[&_td]:px-3 [&_td]:py-1 [&_td]:text-center',
                  index % 2 !== 0 && 'bg-white/5'
                )}>
                <TableCell className="flex w-[80px] items-center justify-start">
                  #{rank}
                </TableCell>
                <TableCell>
                  {displayAddress(
                    isTeam
                      ? (data as ITeamRank).teamName
                      : (data as IIndividualRank).address,
                    3,
                    3
                  )}
                </TableCell>
                <TableCell className="flex w-[100px] items-center justify-end">
                  {formatNumberWithSeparator(data.totalPoint || 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    </BitPointBoardContainer>
  )
}
