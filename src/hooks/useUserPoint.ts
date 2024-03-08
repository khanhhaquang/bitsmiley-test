import { useMutation, useQuery } from '@tanstack/react-query'
import { useUserInfo } from '@/hooks/useUserInfo'
import { TeamService } from '@/services/team'

export const useUserPoint = () => {
  const { address } = useUserInfo()
  const {
    data: userPoint,
    isLoading: isLoadingUserPoint,
    isRefetching: isRefetchingUserPoint,
    refetch: refetchUserPoint
  } = useQuery({
    queryKey: [TeamService.getUserPointInfo.key, address],
    queryFn: () =>
      !address ? null : TeamService.getUserPointInfo.call(address),
    enabled: !!address,
    select: (res) => res?.data
  })

  const { mutateAsync: createTeam, isPending: isPendingCreateTeam } =
    useMutation({
      mutationKey: [TeamService.createTeam.key, address],
      mutationFn: !address
        ? undefined
        : () => TeamService.createTeam.call(address),
      onSuccess: (data) => data.code === 0 && refetchUserPoint()
    })

  const isCreatingTeam = isPendingCreateTeam || isRefetchingUserPoint

  const { mutateAsync: joinTeam, isPending: isPendingJoinTeam } = useMutation({
    mutationKey: [TeamService.joinTeam.key, address],
    mutationFn: !address
      ? undefined
      : (inviteCode: string) => TeamService.joinTeam.call(address, inviteCode),
    onSuccess: (data) => data.code === 0 && refetchUserPoint()
  })

  const isJoiningTeam = isPendingJoinTeam || isRefetchingUserPoint

  const isJoined = userPoint?.joinTeam
  const isCaptain =
    isJoined &&
    userPoint?.captainAddress?.toLowerCase() === address?.toLowerCase()
  const isMember = !isCaptain

  return {
    userPoint,
    isJoined,
    isCaptain,
    isMember,
    isLoading: isLoadingUserPoint,
    createTeam,
    isCreatingTeam,
    joinTeam,
    isJoiningTeam
  }
}
