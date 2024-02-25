import { Address } from 'viem'
import { useAccount } from 'wagmi'

export const useUserInfo = () => {
  const {
    address: evmAddress,
    isConnected: isEvmConnected,
    isConnecting
  } = useAccount()

  return {
    address: evmAddress || ('' as Address),
    isConnected: isEvmConnected,
    isLoading: isConnecting
  }
}
