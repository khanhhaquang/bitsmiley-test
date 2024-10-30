import { useState } from 'react'

import { InputIndicatorIcon, PeopleIcon, StarIcon } from '@/assets/icons'
import { InfoIndicator } from '@/components/InfoIndicator'
import { Pagination } from '@/components/Pagination'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { usePagination } from '@/hooks/usePagination'
import { useTeamInfo } from '@/hooks/useTeamInfo'
import { useUserInfo } from '@/hooks/useUserInfo'
import { useUserPoint } from '@/hooks/useUserPoint'
import { IPageParams, ITeamMember, TeamService } from '@/services/team'
import { cn } from '@/utils/cn'
import { displayAddress } from '@/utils/formatter'
import { formatNumberWithSeparator } from '@/utils/number'

import { BitPointBoardContainer } from './BitPointBoardContainer'
import { SearchInput } from './SearchInput'

export const YourTeam: React.FC = () => {
  const { isCaptain } = useUserPoint()
  const { myTeamInfo } = useTeamInfo()

  const { level, rank, teamTotal, totalPoint, teamMemberTotal, teamName } =
    myTeamInfo || {}

  return (
    <BitPointBoardContainer
      title="Your Team"
      titleClassName="bg-green/60"
      containerClassName="border-green/50">
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 text-sm text-green/70">
          <div className="h-[1px] flex-1 bg-green/60" />
          <div className="font-ibmb">Team bitPoint</div>
          <div className="h-[1px] flex-1 bg-green/60" />
        </div>
        <div className="flex items-center justify-center font-smb text-lg">
          {formatNumberWithSeparator(totalPoint || 0)}
        </div>
      </div>

      <div className="flex flex-col gap-y-4">
        <div className="flex items-center gap-x-2 text-sm text-green/70">
          <div className="h-[1px] flex-1 bg-green/60" />
          <div className="font-ibmb">Rank</div>
          <div className="h-[1px] flex-1 bg-green/60" />
        </div>
        <div className="flex items-end justify-center font-smb">
          <span className="text-lg">
            {formatNumberWithSeparator(rank || 0)}/
          </span>
          <span className="text-[8px] text-white/50">
            {formatNumberWithSeparator(teamTotal || 0)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-y-4 pb-3">
        <div className="flex items-center gap-x-2 text-sm text-green/70">
          <div className="h-[1px] flex-1 bg-green/60" />
          <div className="font-ibmb">
            Level <InfoIndicator message="Level" />
          </div>
          <div className="h-[1px] flex-1 bg-green/60" />
        </div>

        <div className="flex items-center justify-center gap-x-2">
          {Array(6)
            .fill(1)
            .map((_, index) => (
              <StarIcon
                key={index}
                className={cn(
                  'text-white/10',
                  index < (level || 0) && 'text-pink'
                )}
              />
            ))}
        </div>
      </div>

      {isCaptain ? (
        <CheckTeamMates />
      ) : (
        <div className="flex h-8 items-center justify-between bg-green/60 px-2 py-1.5 font-ibmr text-sm text-black">
          <span>
            Team name: <span>{teamName}</span>
          </span>
          <span className="flex items-center gap-x-0.5">
            <PeopleIcon width={12} height={12} />
            <span>{formatNumberWithSeparator(teamMemberTotal || 0)}</span>
          </span>
        </div>
      )}
    </BitPointBoardContainer>
  )
}

const CheckTeamMates: React.FC = () => {
  const { address } = useUserInfo()
  const { myTeamInfo } = useTeamInfo()
  const { teamMemberTotal } = myTeamInfo || {}

  const [isOpen, setIsOpen] = useState(false)

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
  } = usePagination<ITeamMember>({
    queryKey: !address ? [] : [TeamService.getMyTeamMembers.key, address],
    queryFn: !address
      ? undefined
      : (params: IPageParams) =>
          TeamService.getMyTeamMembers.call(params, address),
    pageSize: 12
  })

  return (
    <Collapsible open={isOpen}>
      <CollapsibleTrigger
        className="w-full"
        onClick={() => setIsOpen((v) => !v)}>
        <div className="group flex cursor-pointer items-center justify-between bg-green/50 px-2 py-1.5 font-ibmr text-sm text-black hover:bg-green/60">
          <span className="flex items-center gap-x-1 group-hover:font-ibmb">
            <InputIndicatorIcon
              className={cn('transition-all', isOpen && 'rotate-90')}
            />
            Check teammates
          </span>
          <span className="flex items-center gap-x-0.5">
            <PeopleIcon width={12} height={12} />
            <span>{teamMemberTotal}</span>
          </span>
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3">
        <SearchInput onChange={setSearchValue} />

        <Table className="mb-3 font-ibmr text-xs">
          <TableHeader className="mb-0 text-white/50 [&_tr]:mb-0 [&_tr]:border-white/20 [&_tr]:px-3 [&_tr]:py-1">
            <TableRow>
              <TableHead className="w-20 whitespace-nowrap py-0 pr-[50px]">
                Member address
              </TableHead>
              <TableHead className="w-[100px] py-0 pl-[42px]">
                bitPoint
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPageData?.map((item, index) => (
              <TableRow
                key={item.id}
                className={cn(
                  '[&_td]:px-3 [&_td]:pt-1 [&_td]:pb-1.5 [&_td]:text-center',
                  index % 2 !== 0 && 'bg-white/5'
                )}>
                <TableCell className="flex w-20 items-center justify-start pr-[57px]">
                  {displayAddress(item.memberAddress, 3, 3)}
                </TableCell>
                <TableCell className="flex w-[100px] items-center justify-end pl-14">
                  {formatNumberWithSeparator(item.totalPoint || 0)}
                </TableCell>
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
      </CollapsibleContent>
    </Collapsible>
  )
}
