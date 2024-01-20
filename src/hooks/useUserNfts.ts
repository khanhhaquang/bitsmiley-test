import { UserService } from '@/services/user'
import { useQuery } from 'react-query'
import { useUserInfo } from './useUserInfo'

export const useUserNfts = () => {
  const { address } = useUserInfo()

  const { data: nftsDataRes, isLoading } = useQuery(
    [UserService.getNFTs.key, address],
    () => UserService.getNFTs.call(address),
    {
      enabled: !!address
    }
  )

  const nfts = nftsDataRes?.data?.data?.nfts

  const hasNftMinted = nfts?.find(
    (n) => !!n.inscription_id && !n.invalid_reason
  )

  return { nfts, hasNftMinted, isLoading }
}
