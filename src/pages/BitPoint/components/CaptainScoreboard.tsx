import { CopyIcon, CrownIcon, LevelIcon, PeopleIcon } from '@/assets/icons'
import { SearchInput } from './SearchInput'
import { usePagination } from '@/hooks/usePagination'
import { IPageParams, ITeamMember, TeamService } from '@/services/team'
import { useUserInfo } from '@/hooks/useUserInfo'
import { Pagination } from './Pagination'
import { displayAddress } from '@/utils/formatter'
import { useTeamInfo } from '@/hooks/useTeamInfo'
import { copyToClipboard } from '@/utils/copy'

export const CaptainScoreboard: React.FC = () => {
  const { address } = useUserInfo()
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

  const { myTeamInfo } = useTeamInfo()

  const handleCopy = () => {
    copyToClipboard(myTeamInfo?.invitationCode || '')
  }

  if (!myTeamInfo) return null

  return (
    <div className="relative border border-green/30 bg-black text-white">
      <div className="absolute inset-0 z-0 bg-scoreboard" />
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
                {myTeamInfo.invitationCode}
              </span>
              <CopyIcon
                onClick={handleCopy}
                className="cursor-pointer text-green hover:text-green/70"
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-y-1">
          <div className="font-ibmr text-sm text-white/70">Team bitPoint</div>
          <div className="font-ppnb text-5xl">{myTeamInfo.totalPoint}</div>
        </div>

        <div className="mt-4 flex items-start justify-between">
          <div className="flex flex-col gap-y-1">
            <div className="font-ibmr text-sm text-white/70">Team Rank</div>
            <div className="flex items-end">
              <span className="font-ppnb text-5xl">{myTeamInfo.rank}</span>
              <span className="pb-1.5 font-ppnb text-2xl text-white/50">
                /{myTeamInfo.teamTotal}
              </span>
            </div>
          </div>

          {myTeamInfo.level && (
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
                {myTeamInfo.teamMemberTotal}
              </span>
            </span>
          </div>
        </div>

        <div className="mx-auto mb-9 flex w-[321px] flex-col items-center gap-y-2">
          <SearchInput className="w-[321px]" onChange={setSearchValue} />
          <div className="flex w-full items-center justify-between font-ibmr text-sm text-green/70">
            <span>Member name</span>
            <span>bitPoint</span>
          </div>

          {currentPageData?.map((item) => (
            <div
              key={item.id}
              className="flex w-full items-center justify-between font-ibmr text-sm">
              <span>{displayAddress(item.memberAddress, 3, 3)}</span>
              <span>{item.totalPoint}</span>
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
  )
}
