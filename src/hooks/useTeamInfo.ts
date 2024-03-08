import { TeamService } from '@/services/team'
import { useQuery } from '@tanstack/react-query'
import { useUserInfo } from '@/hooks/useUserInfo'

export const useTeamInfo = () => {
  const { address } = useUserInfo()

  const {
    data: myTeamInfo,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: [TeamService.getMyTeamInfo.key, address],
    queryFn: () => (!address ? null : TeamService.getMyTeamInfo.call(address)),
    enabled: !!address,
    select: (res) => res?.data
  })

  return { myTeamInfo, isLoading, ...rest }
}
