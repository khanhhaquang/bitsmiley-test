import { useQuery } from '@tanstack/react-query'

import { PointService } from '@/services/point'

import { useUserInfo } from './useUserInfo'

export const usePointAirdrop = () => {
  const { address } = useUserInfo()

  const data = useQuery({
    queryKey: [PointService.getPointAirdrop.key, address],
    queryFn: () =>
      address ? PointService.getPointAirdrop.call(address) : undefined,
    select: (res) => (!res ? undefined : res.data)
  })

  return data
}
