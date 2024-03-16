import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { customChains } from '@/config/wagmi'
import { UserService } from '@/services/user'

export const useUserInfo = () => {
  const { accounts: btcAccounts } = useBTCProvider()
  const {
    address: evmAddress,
    chain,
    isConnected: isEvmConnected,
    isConnecting
  } = useAccount()

  const addressForDisplay = (btcAccounts[0] as Address) || evmAddress

  const { data: enabledFeatures, isLoading: isLoadingEnabledFeatures } =
    useQuery({
      queryKey: [UserService.getEnabledFeatures.key, addressForDisplay],
      queryFn: () =>
        !addressForDisplay
          ? null
          : UserService.getEnabledFeatures.call(addressForDisplay),
      enabled: !!addressForDisplay,
      select: (res) => res?.data
    })

  const blockExplorerUrl = useMemo(
    () =>
      customChains.find((c) => c.id === chain?.id)?.blockExplorers?.default.url,
    [chain?.id]
  )

  const isLoading = isConnecting || isLoadingEnabledFeatures

  return {
    isConnected: isEvmConnected,
    address: evmAddress,
    addressForDisplay,
    enabledFeatures,
    blockExplorerUrl,
    isLoading
  }
}
