import dayjs from 'dayjs'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { ChevronLeftIcon } from '@/assets/icons'
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
import { useUserInfo } from '@/hooks/useUserInfo'
import { IPageParams, IUserPointHistory, TeamService } from '@/services/team'
import { cn } from '@/utils/cn'
import { formatNumberWithSeparator } from '@/utils/number'

import { BitPointTitle } from './components/BitPointTitle'

const TABLE_PLACE_HOLDER = 'place_holder'

const BitPointHistory: React.FC = () => {
  const navigate = useNavigate()
  const { address } = useUserInfo()
  const {
    currentPageData,
    currentPageNum,
    hasPreviousPage,
    hasNextPage,
    fetchNextPage,
    totalPagesNum,
    fetchPreviousPage,
    setCurrentPageNum
  } = usePagination<IUserPointHistory>({
    queryKey: !address ? [] : [TeamService.getUserPointHistory.key, address],
    queryFn: !address
      ? undefined
      : (params: IPageParams) =>
          TeamService.getUserPointHistory.call(params, address),
    pageSize: 10
  })

  const currentPageLength = currentPageData?.length || 0
  const filledTableRows = currentPageLength < 10 ? 10 - currentPageLength : 0

  const currenPage = [
    ...(currentPageData || []),
    ...Array(filledTableRows)
      .fill(1)
      .map((_, index) => ({
        id: currentPageLength + index,
        address: TABLE_PLACE_HOLDER,
        bitDiscBoost: TABLE_PLACE_HOLDER,
        liquidity: TABLE_PLACE_HOLDER,
        mintBitUSD: TABLE_PLACE_HOLDER,
        stake: TABLE_PLACE_HOLDER,
        teamBoost: TABLE_PLACE_HOLDER,
        totalPoint: TABLE_PLACE_HOLDER,
        updateTime: TABLE_PLACE_HOLDER
      }))
  ]

  return (
    <div className="size-full overflow-x-hidden py-10 text-white">
      <BitPointTitle title="bitPoint History" className="mb-3" />

      <div className="flex w-full flex-col items-center gap-y-3">
        <Table className="w-full font-ibmr text-xs">
          <TableHeader className="[&_tr]:mb-3">
            <TableRow className="border-b border-white/20 px-3 py-4 text-white/50">
              <TableHead>bitPoint Sources</TableHead>
              <TableHead>Mint bitUSD</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>Liquidity</TableHead>
              <TableHead>Team boost</TableHead>
              <TableHead>bitDisc boost</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currenPage?.map((v, index) => (
              <TableRow
                key={v.id}
                className={cn(
                  'px-3 py-2 min-h-10',
                  index % 2 !== 0 && 'bg-white/5'
                )}>
                <TableCell>
                  {v.updateTime !== TABLE_PLACE_HOLDER &&
                    dayjs(v.updateTime).format('MM/DD/YYYY')}
                </TableCell>
                <TableCell>
                  {v.mintBitUSD !== TABLE_PLACE_HOLDER &&
                    `+${formatNumberWithSeparator(v.mintBitUSD)}`}
                </TableCell>
                <TableCell>
                  {v.stake !== TABLE_PLACE_HOLDER &&
                    `+${formatNumberWithSeparator(v.stake)}`}
                </TableCell>
                <TableCell>
                  {v.liquidity !== TABLE_PLACE_HOLDER &&
                    `+${formatNumberWithSeparator(v.liquidity)}`}
                </TableCell>
                <TableCell>
                  {v.teamBoost !== TABLE_PLACE_HOLDER && `+${v.teamBoost}%`}
                </TableCell>
                <TableCell>
                  {v.bitDiscBoost !== TABLE_PLACE_HOLDER &&
                    `+${v.bitDiscBoost}%`}
                </TableCell>
                <TableCell>
                  {v.totalPoint !== TABLE_PLACE_HOLDER &&
                    formatNumberWithSeparator(v.totalPoint)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex w-full items-center justify-between">
          <button
            className="flex cursor-pointer items-center justify-center gap-x-2 border border-white/20 bg-white/5 px-4 py-1 font-ibmb text-sm text-white/70 shadow-bitpoint-history-back-button hover:text-white/50"
            onClick={() => navigate(-1)}>
            <ChevronLeftIcon />
            Back
          </button>

          {Number(totalPagesNum) > 1 && (
            <Pagination
              hasNextPage={hasNextPage}
              onClickNext={fetchNextPage}
              totalPagesNum={totalPagesNum}
              currentPageNum={currentPageNum}
              hasPreviousPage={hasPreviousPage}
              onClickPrevious={fetchPreviousPage}
              setCurrentPageNum={setCurrentPageNum}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default BitPointHistory
