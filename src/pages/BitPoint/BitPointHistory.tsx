import React from 'react'

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

import { BitPointTitle } from './components/BitPointTitle'

const BitPointHistory: React.FC = () => {
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
  return (
    <div className="size-full overflow-x-hidden py-10 text-white">
      <BitPointTitle title="bitPoint History" className="mb-3" />

      <div className="flex w-full flex-col items-center gap-y-12">
        <Table className="mb-14 w-full font-ibmr">
          <TableHeader className="text-base">
            <TableRow className="border-dashed px-6 pb-6">
              <TableHead>bitPoint Sources</TableHead>
              <TableHead>Mint bitUSD</TableHead>
              <TableHead>Stake</TableHead>
              <TableHead>Liquidity ⓘ</TableHead>
              <TableHead>Team boost</TableHead>
              <TableHead>bitDisc boost</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentPageData?.map((v) => (
              <TableRow key={v.id} className="p-6">
                <TableCell>{v.updateTime.toString()}</TableCell>
                <TableCell>{v.mintBitUSD}</TableCell>
                <TableCell>{v.stake}</TableCell>
                <TableCell>{v.liquidity}</TableCell>
                <TableCell>{v.teamBoost}</TableCell>
                <TableCell>{v.bitDiscBoost}</TableCell>
                <TableCell>{v.totalPoint}</TableCell>
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

        <div className="mt-5 w-full border-b border-dashed" />
      </div>
    </div>
  )
}

export default BitPointHistory
