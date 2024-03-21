import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useUserInfo } from '@/hooks/useUserInfo'
import { UserService } from '@/services/user'

export const useUserMintingPairs = (chainId?: number | string) => {
  const { address, evmChainId } = useUserInfo()

  const {
    data: mintingPairs,
    isLoading,
    ...rest
  } = useQuery({
    queryKey: [UserService.getMintingPairs.key, address],
    queryFn: () =>
      !address ? null : UserService.getMintingPairs.call(address),
    enabled: !!address,
    select: (res) => res?.data
  })

  const availableMintingPairs = mintingPairs?.filter(
    (item) => !item.isOpenVault
  )
  const openedMintingPairs = mintingPairs?.filter(
    (item) => item.isOpenVault && item.chainId === evmChainId
  )

  const isMyVault = useMemo(() => {
    if (!chainId) return false
    return !!openedMintingPairs?.find((p) => p.chainId === Number(chainId))
  }, [chainId, openedMintingPairs])

  const mintingPair = useMemo(
    () => mintingPairs?.find((p) => p.chainId === Number(chainId)),
    [chainId, mintingPairs]
  )

  return {
    availableMintingPairs,
    openedMintingPairs,
    mintingPair,
    isLoading,
    isMyVault,
    ...rest
  }
}
