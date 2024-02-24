import { Address } from 'viem'
import { useAccount } from 'wagmi'

export const useUserInfo = () => {
  const { address: evmAddress, isConnected: isEvmConnected } = useAccount()

  // const { data } = useQuery(
  //   [UserService.getHasActivatedInvitation.key, address],
  //   () => UserService.getHasActivatedInvitation.call(address),
  //   { enabled: !!address }
  // )

  // const isWhitelist = data?.data?.data
  // const isWhitelist = false
  // const isFetchedUserInfo = useMemo(() => {
  //   if (address) {
  //     return typeof isWhitelist === 'boolean'
  //   }
  //   return true
  // }, [address, isWhitelist])

  return {
    address: evmAddress || ('' as Address),
    isConnected: isEvmConnected,
    isWhitelist: false,
    isLoading: false
  }
}
