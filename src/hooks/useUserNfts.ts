import { UserService } from '@/services/user'
import { useQuery } from 'react-query'
import { useUserInfo } from './useUserInfo'

export const useUserNfts = () => {
  const { address } = useUserInfo()

  const { data: nftsData, isLoading } = useQuery(
    [UserService.getNFTs.key, address],
    () => UserService.getNFTs.call(address),
    {
      enabled: !!address
    }
  )

  const hasNftMinted = !!nftsData?.data?.[0]?.inscription_id

  return { nfts: nftsData?.data, hasNftMinted, isLoading }
}
