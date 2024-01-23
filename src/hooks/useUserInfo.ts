import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { UserService } from '@/services/user'
import { getAccountInfo, getIsConnected } from '@/store/account/reducer'

export const useUserInfo = () => {
  const isConnected = useSelector(getIsConnected)
  const { address } = useSelector(getAccountInfo)
  const { data, isLoading } = useQuery(
    [UserService.getHasActivatedInvitation.key, address],
    () => UserService.getHasActivatedInvitation.call(address),
    { enabled: !!address }
  )

  const isWhitelist = data?.data?.data

  return { address, isConnected, isWhitelist, isLoading }
}
