import { CrownIcon, LevelIcon, PeopleIcon } from '@/assets/icons'
import { SearchInput } from './SearchInput'
import { usePagination } from '@/hooks/usePagination'
import { IPageParams, ITeamMember, TeamService } from '@/services/team'
import { useUserInfo } from '@/hooks/useUserInfo'
import { Pagination } from '@/components/Pagination'
import { displayAddress } from '@/utils/formatter'
import { useTeamInfo } from '@/hooks/useTeamInfo'
import { CopyButton } from '@/components/CopyButton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export const CaptainScoreboard: React.FC = () => {
  const { address } = useUserInfo()
  const { myTeamInfo } = useTeamInfo()
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
    <div className="relative w-[497px] shrink-0 border border-green/30 bg-black text-white">
      <div className="absolute inset-0 z-0 bg-bitpointPointBg bg-cover bg-no-repeat" />
      <div className="absolute inset-0 z-0 bg-green5 mix-blend-hard-light" />

      <div className="relative z-10 px-7 pb-6 pt-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-x-1 text-green/40">
            <CrownIcon />
            <span className="font-ppnb text-2xl">Hi Captain</span>
          </div>
          <div className="flex flex-col items-end gap-y-1.5">
            <div className="flex items-center font-ibmr text-sm text-white/70">
              Invitation code:
            </div>
            <div className="flex items-center gap-x-1.5">
              <span className="font-ibmr font-bold">
                {myTeamInfo?.invitationCode}
              </span>
              <CopyButton text={myTeamInfo?.invitationCode} />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-y-1">
          <div className="font-ibmr text-sm text-white/70">Team bitPoint</div>
          <div className="font-ppnb text-6xl">{myTeamInfo?.totalPoint}</div>
        </div>

        <div className="mt-4 flex items-start justify-between">
          <div className="flex flex-col gap-y-1">
            <div className="font-ibmr text-sm text-white/70">Team Rank</div>
            <div className="flex items-end">
              <div className="font-ppnb text-6xl text-white">
                {myTeamInfo?.rank}
                <span className="text-2xl text-white/50">
                  /{myTeamInfo?.teamTotal}
                </span>
              </div>
            </div>
          </div>

          {!!myTeamInfo?.level && (
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

        <div className="mb-2.5 mt-7 h-[1px] w-[439px] bg-green/30" />

        <div className="mb-2.5">
          <div className="flex items-center justify-between">
            <span className="font-ibmr text-sm text-white/70">Members</span>
            <span className="flex items-center justify-between gap-x-1">
              <PeopleIcon />
              <span className="font-ibmr text-sm text-white/70">
                {myTeamInfo?.teamMemberTotal}
              </span>
            </span>
          </div>
        </div>

        <div className="mx-auto mb-9 flex w-[321px] flex-col items-center gap-y-2">
          <SearchInput
            onChange={setSearchValue}
            className="w-[321px] border border-white/20 backdrop-blur-sm placeholder:text-white/50"
          />
          <Table className="font-ibmr">
            <TableHeader className="text-sm text-green/70 [&_tr]:border-b-0">
              <TableRow>
                <TableHead>Member name</TableHead>
                <TableHead>bitPoint</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentPageData?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    {displayAddress(item.memberAddress, 3, 3)}
                  </TableCell>
                  <TableCell>{item.totalPoint}</TableCell>
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
          activeNumClassName="text-green/70"
        />
      </div>
    </div>
  )
}
