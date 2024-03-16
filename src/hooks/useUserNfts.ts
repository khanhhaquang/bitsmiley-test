import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useMemo } from 'react'

import { INft, UserService } from '@/services/user'
import { IResponse } from '@/types/common'

import { useUserInfo } from './useUserInfo'

export const useUserNfts = () => {
  const { address, isConnected } = useUserInfo()
  const queryClient = useQueryClient()

  const { data: nftsDataRes, ...rest } = useQuery({
    queryKey: [UserService.getNFTs.key, address],
    queryFn: () => (address ? UserService.getNFTs.call(address) : null),
    enabled: !!address && isConnected,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
    select: (res) => res?.data
  })

  const nfts = useMemo(() => nftsDataRes || [], [nftsDataRes])

  const removeLocalNft = useCallback(
    (tokenId: number) => {
      const newLocal = (old: IResponse<INft[]> | undefined) => {
        return (
          old && {
            ...old,
            data: old?.data?.filter((v) => v.tokenID !== tokenId)
          }
        )
      }
      queryClient.setQueryData<IResponse<INft[]>>(
        [UserService.getNFTs.key, address],
        newLocal
      )
    },
    [address, queryClient]
  )

  return {
    nfts,
    removeLocalNft,
    ...rest
  }
}
