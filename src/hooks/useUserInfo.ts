import {
  useBTCProvider,
  useETHProvider
} from '@particle-network/btc-connectkit'
import { SuiMainnetChain, SuiTestnetChain, useWallet } from '@suiet/wallet-kit'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { Address, isAddressEqual } from 'viem'
import { useAccount } from 'wagmi'

import { customChains, suiMainnet, suiTestnet } from '@/config/wagmi'
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

  const suiWallet = useWallet()

  const isConnected = useMemo(
    () => isEvmConnected || suiWallet.connected,
    [isEvmConnected, suiWallet.connected]
  )

  const suiWalletAddress = useMemo(() => {
    return suiWallet.address
  }, [suiWallet.address])

  const displayAddress = useMemo(
    () => (suiWalletAddress as Address) || evmAddress,
    [suiWalletAddress, evmAddress]
  )
  const addressForDisplay = (btcAccounts[0] as Address) || displayAddress

  const { data: enabledFeaturesData, isLoading: isLoadingEnabledFeatures } =
    useQuery({
      queryKey: [UserService.getEnabledFeatures.key, addressForDisplay],
      queryFn: () =>
        !addressForDisplay
          ? null
          : UserService.getEnabledFeatures.call(addressForDisplay),
      enabled: !!addressForDisplay,
      select: (res) => res?.data,
      refetchOnWindowFocus: false,
      refetchOnMount: false
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
    () =>
      isConnecting ||
      isReconnecting ||
      isLoadingEnabledFeatures ||
      suiWallet.connecting,
    [
      isConnecting,
      isLoadingEnabledFeatures,
      isReconnecting,
      suiWallet.connecting
    ]
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

  const { chainId: suiChainIdAsNumber, blockExplorerUrl: suiBlockExplorerUrl } =
    useMemo(() => {
      if (suiWallet.chain?.id === SuiMainnetChain.id)
        return {
          chainId: suiMainnet.id,
          blockExplorerUrl: suiMainnet.blockExplorers.default
        }
      if (suiWallet.chain?.id === SuiTestnetChain.id)
        return {
          chainId: suiTestnet.id,
          blockExplorerUrl: suiTestnet.blockExplorers.default
        }
      return {}
    }, [suiWallet.chain?.id])

  return {
    isConnectedWithAA,
    isConnected,
    address: displayAddress,
    addressForDisplay,
    enabledFeatures,
    blockExplorerUrl,
    evmChain,
    evmChainId,
    isLoading,
    suiChainIdAsNumber,
    suiBlockExplorerUrl,
    suiWalletAddress,
    isSuiConnected: suiWallet.connected
  }
}
