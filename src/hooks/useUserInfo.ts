import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useAccount } from 'wagmi'

export const useUserInfo = () => {
  const { accounts: btcAccounts } = useBTCProvider()
  const {
    address: evmAddress,
    isConnected: isEvmConnected,
    isConnecting
  } = useAccount()

  return {
    address: evmAddress,
    addressForDisplay: btcAccounts[0] || evmAddress,
    isConnected: isEvmConnected,
    isLoading: isConnecting
  }
}
