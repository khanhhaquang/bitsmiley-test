import { TeamService } from '@/services/team'
import { useQuery } from '@tanstack/react-query'
import { useUserInfo } from '@/hooks/useUserInfo'

export const useTeamInfo = () => {
  const { address } = useUserInfo()

  const { data, isLoading, ...rest } = useQuery({
    queryKey: [TeamService.getMyTeamInfo.key, address],
    queryFn: () => (!address ? null : TeamService.getMyTeamInfo.call(address)),
    enabled: !!address
  })

  const myTeamInfo = data?.data

  return { myTeamInfo, isLoading, ...rest }
}
