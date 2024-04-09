import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address } from 'viem'
import { useAccount } from 'wagmi'

import { customChains } from '@/config/wagmi'
import { IFeaturesEnabled, UserService } from '@/services/user'

export const useUserInfo = () => {
  const { accounts: btcAccounts } = useBTCProvider()
  const {
    address: evmAddress,
    chainId: evmChainId,
    isConnected: isEvmConnected,
    isConnecting,
    isReconnecting
  } = useAccount()

  const addressForDisplay = (btcAccounts[0] as Address) || evmAddress

  const { isLoading: isLoadingEnabledFeatures } = useQuery({
    queryKey: [UserService.getEnabledFeatures.key, addressForDisplay],
    queryFn: () =>
      !addressForDisplay
        ? null
        : UserService.getEnabledFeatures.call(addressForDisplay),
    enabled: !!addressForDisplay,
    select: (res) => res?.data
  })

  const evmChain = useMemo(
    () => customChains.find((c) => c.id === evmChainId),
    [evmChainId]
  )

  const blockExplorerUrl = useMemo(
    () => evmChain?.blockExplorers?.default.url,
    [evmChain]
  )

  const isLoading = isConnecting || isReconnecting || isLoadingEnabledFeatures

  //TODO: THIS IS TEMPORARY MOCK FOR TEST, REMOVE THIS AFTER TESTING DONE
  const enabledFeatures: IFeaturesEnabled = {
    Staking: true,
    AlphaNet: true,
    BitPoint: false
  }

  return {
    isConnectedWithAA: !!(btcAccounts[0] as Address),
    isConnected: isEvmConnected,
    address: evmAddress,
    addressForDisplay,
    enabledFeatures,
    blockExplorerUrl,
    evmChain,
    evmChainId,
    isLoading
  }
}
