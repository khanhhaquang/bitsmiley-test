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
import { useUserPoint } from '@/hooks/useUserPoint'
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
  const { isCaptain } = useUserPoint()
  const [tab, setTab] = useState<ScoreTab>(
    isCaptain ? ScoreTab.Team : ScoreTab.Individual
  )
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
      titleMessage="scoreboard"
      titleClassName="bg-white/50 mb-4"
      containerClassName="bg-black/30 border-white/50 w-[396px]">
      <div className="flex h-full flex-col gap-y-[13px]">
        <div className="flex items-center gap-x-2">
          <span
            className={cn(
              'flex items-center gap-x-1 text-white/50 text-sm bg-white/10 cursor-pointer px-2 py-1',
              isTeam && 'font-ibmb text-black cursor-default bg-white/50',
              !isTeam && 'hover:bg-white/20'
            )}
            onClick={() => handleTabChange(ScoreTab.Team)}>
            <InputIndicatorIcon
              className={cn('size-3 transition-all', isTeam && 'rotate-90')}
            />
            <span>Team</span>
          </span>
          <span
            className={cn(
              'flex items-center gap-x-1 text-white/50 text-sm bg-white/10 cursor-pointer px-2 py-1',
              !isTeam && 'font-ibmb text-black cursor-default bg-white/50',
              isTeam && 'hover:bg-white/20'
            )}
            onClick={() => handleTabChange(ScoreTab.Individual)}>
            <InputIndicatorIcon
              className={cn('size-3 transition-all', !isTeam && 'rotate-90')}
            />
            <span>Individual</span>
          </span>
        </div>

        <div>
          <SearchInput onChange={setSearchValue} />
          <Table className="font-ibmr text-xs">
            <TableHeader className="mb-0 text-white/50 [&_tr]:mb-0 [&_tr]:border-white/20 [&_tr]:px-3 [&_tr]:py-1">
              <TableRow>
                <TableHead className="w-20 py-0 pr-[50px]">Rank</TableHead>
                <TableHead className="flex w-[109px] items-center justify-start text-nowrap py-0 pl-[11px] pr-[33px]">
                  {isTeam ? 'Team name' : 'User address'}
                </TableHead>
                <TableHead className="w-[100px] py-0 pl-[42px]">
                  bitPoint
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData?.map(([data, rank], index) => (
                <TableRow
                  key={data.id}
                  className={cn(
                    '[&_td]:px-3 [&_td]:pt-1 [&_td]:pb-1.5 [&_td]:text-center',
                    index % 2 !== 0 && 'bg-white/5'
                  )}>
                  <TableCell className="flex w-20 items-center justify-start pr-[57px]">
                    #{rank}
                  </TableCell>
                  <TableCell className="flex w-[109px] items-center justify-start text-nowrap pl-[11px] pr-[33px]">
                    {isTeam
                      ? (data as ITeamRank).teamName
                      : displayAddress((data as IIndividualRank).address, 3, 3)}
                  </TableCell>
                  <TableCell className="flex w-[100px] items-center justify-end pl-14">
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
      </div>
    </BitPointBoardContainer>
  )
}
