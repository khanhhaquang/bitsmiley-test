import { useAccount } from 'wagmi'

export const useUserInfo = () => {
  const {
    address: evmAddress,
    isConnected: isEvmConnected,
    isConnecting
  } = useAccount()

  return {
    address: evmAddress,
    isConnected: isEvmConnected,
    isLoading: isConnecting
  }
}
