import {
  useBTCProvider,
  useETHProvider
} from '@particle-network/btc-connectkit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address, isAddressEqual } from 'viem'
import { useAccount } from 'wagmi'

import { customChains } from '@/config/wagmi'
import { IFeaturesEnabled, UserService } from '@/services/user'

export const useUserInfo = () => {
  const { accounts: btcAccounts } = useBTCProvider()
  const { account: aaEthAccount } = useETHProvider()
  const {
    address: evmAddress,
    chainId: evmChainId,
    isConnected: isEvmConnected,
    isConnecting,
    isReconnecting
  } = useAccount()

  const addressForDisplay = (btcAccounts[0] as Address) || evmAddress

  const { data: enabledFeaturesData, isLoading: isLoadingEnabledFeatures } =
    useQuery({
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

  const isLoading = useMemo(
    () => isConnecting || isReconnecting || isLoadingEnabledFeatures,
    [isConnecting, isLoadingEnabledFeatures, isReconnecting]
  )

  const isConnectedWithAA = useMemo(() => {
    return (
      !!aaEthAccount &&
      !!evmAddress &&
      isAddressEqual(aaEthAccount as Address, evmAddress as Address)
    )
  }, [aaEthAccount, evmAddress])

  //TODO: THIS IS TEMPORARY MOCK FOR TEST, REMOVE THIS AFTER TESTING DONE
  const enabledFeatures: IFeaturesEnabled = useMemo(
    () => ({
      Staking: true,
      AlphaNet: true,
      BitPoint: !!enabledFeaturesData?.BitPoint
    }),
    [enabledFeaturesData?.BitPoint]
  )

  return {
    isConnectedWithAA,
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
