import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { UserService } from '@/services/user'
import { getAccountInfo, getIsConnected } from '@/store/account/reducer'

export const useUserInfo = () => {
  const isConnected = useSelector(getIsConnected)
  const { address } = useSelector(getAccountInfo)
  const { data, isLoading } = useQuery(
    [UserService.getUserInfo.key, address],
    () => UserService.getUserInfo.call(address),
    { enabled: !!address }
  )

  const isWhitelist = !!data?.data.data.whitelistStatus

  return { address, isConnected, isWhitelist, isLoading }
}
