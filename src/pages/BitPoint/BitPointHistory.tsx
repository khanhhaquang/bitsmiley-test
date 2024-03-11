import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftThinIcon } from '@/assets/icons'
import { usePagination } from '@/hooks/usePagination'
import { useUserInfo } from '@/hooks/useUserInfo'
import { IPageParams, IUserPointHistory, TeamService } from '@/services/team'
import { Pagination } from '@/components/Pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

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
    <div className="flex h-screen items-start justify-center gap-x-7 overflow-x-hidden py-[180px] text-white md:px-[120px] 2xl:px-[242px]">
      <div className="flex w-full flex-col items-center gap-y-12">
        <h1 className="relative w-full text-center font-ibmb text-2xl">
          <Link
            to="../"
            className="absolute left-10 flex items-center gap-x-4 font-ppnb text-4xl">
            <ArrowLeftThinIcon width={21} height={35} />
            back
          </Link>
          bitPoint History
        </h1>
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
              <TableRow key={v.id} className="px-6 py-6">
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
