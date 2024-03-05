import { useAccount } from 'wagmi'
import { UserService } from '@/services/user'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export const useMintingPairs = (chainId?: number) => {
  const { address } = useAccount()
  const { data, isLoading, ...rest } = useQuery({
    queryKey: [UserService.getMintingPairs.key, address],
    queryFn: () =>
      !address ? null : UserService.getMintingPairs.call(address),
    enabled: !!address
  })

  const mintingPairs = data?.data
  const mintingPair = useMemo(
    () => data?.data?.find((pair) => pair.chainId === chainId),
    [data, chainId]
  )

  return { mintingPair, mintingPairs, isLoading, ...rest }
}
