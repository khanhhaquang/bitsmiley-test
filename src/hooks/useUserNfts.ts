import { UserService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useUserInfo } from './useUserInfo'
import { useMemo } from 'react'

export const useUserNfts = () => {
  const { address } = useUserInfo()

  const { data: nftsDataRes, isLoading } = useQuery({
    queryKey: [UserService.getNFTs.key, address],
    queryFn: () => UserService.getNFTs.call(address),
    enabled: !!address
  })

  const nfts = useMemo(() => nftsDataRes?.data?.data?.nfts, [nftsDataRes])

  return {
    nfts,
    isLoading
  }
}
