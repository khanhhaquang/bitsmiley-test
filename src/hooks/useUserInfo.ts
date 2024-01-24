import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { UserService } from '@/services/user'
import { getAccountInfo, getIsConnected } from '@/store/account/reducer'
import { useMemo } from 'react'

export const useUserInfo = () => {
  const isConnected = useSelector(getIsConnected)
  const { address } = useSelector(getAccountInfo)
  const { data } = useQuery(
    [UserService.getHasActivatedInvitation.key, address],
    () => UserService.getHasActivatedInvitation.call(address),
    { enabled: !!address }
  )

  const isWhitelist = data?.data?.data
  const isFetchedUserInfo = useMemo(() => {
    if (address) {
      return typeof isWhitelist === 'boolean'
    }
    return true
  }, [address, isWhitelist])

  return { address, isConnected, isWhitelist, isLoading: !isFetchedUserInfo }
}
