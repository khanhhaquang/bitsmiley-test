import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { useUserInfo } from '@/hooks/useUserInfo'
import { IMintingPair, UserService } from '@/services/user'

export const useUserMintingPairs = (chainId?: number | string) => {
  const { address } = useUserInfo()

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

  const availableMintingPairs = mintingPairs
    ?.filter((item) => !item.isOpenVault)
    .reduce<Record<string, IMintingPair[]>>(
      (pre, curr) => ({
        ...pre,
        [curr.chainId]: pre?.[curr.chainId]
          ? pre[curr.chainId].push(curr)
          : [curr]
      }),
      {}
    )

  const openedMintingPairs = mintingPairs
    ?.filter((item) => item.isOpenVault)
    .reduce<Record<string, IMintingPair[]>>(
      (pre, curr) => ({
        ...pre,
        [curr.chainId]: pre?.[curr.chainId]
          ? pre[curr.chainId].push(curr)
          : [curr]
      }),
      {}
    )

  const hasOpenedMintingPairs = !!mintingPairs?.filter(
    (item) => item.isOpenVault
  ).length

  const isMyVault = useMemo(() => {
    if (!chainId) return false
    return !!mintingPairs
      ?.filter((item) => item.isOpenVault)
      ?.find((p) => p.chainId === Number(chainId))
  }, [chainId, mintingPairs])

  const mintingPair = useMemo(
    () => mintingPairs?.find((p) => p.chainId === Number(chainId)),
    [chainId, mintingPairs]
  )

  return {
    availableMintingPairs,
    openedMintingPairs,
    hasOpenedMintingPairs,
    mintingPair,
    isLoading,
    isMyVault,
    ...rest
  }
}
