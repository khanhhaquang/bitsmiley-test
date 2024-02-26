import { UserService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useUserInfo } from './useUserInfo'
import { useMemo } from 'react'

export const useUserNfts = () => {
  const { address, isConnected } = useUserInfo()

  const { data: nftsDataRes, ...rest } = useQuery({
    queryKey: [UserService.getNFTs.key, address],
    queryFn: () => UserService.getNFTs.call(address),
    enabled: !!address && isConnected,
    select: (res) => res.data
  })

  const nfts = useMemo(() => nftsDataRes || [], [nftsDataRes])

  return {
    nfts,
    ...rest
  }
}
