import { UserService } from '@/services/user'
import { useQuery } from 'react-query'
import { useUserInfo } from './useUserInfo'
import { useEffect, useMemo } from 'react'
import { useStoreActions } from './useStoreActions'

export const useUserNfts = () => {
  const { setTxId } = useStoreActions()
  const { address } = useUserInfo()

  const { data: nftsDataRes, isLoading } = useQuery(
    [UserService.getNFTs.key, address],
    () => UserService.getNFTs.call(address),
    {
      enabled: !!address
    }
  )

  const mintedNft = useMemo(
    () =>
      nftsDataRes?.data?.data?.nfts?.find(
        (n) => !!n.inscription_id && !n.invalid_reason
      ),
    [nftsDataRes]
  )

  useEffect(() => {
    if (mintedNft) {
      setTxId(mintedNft.txid)
    }
  }, [mintedNft, setTxId])

  return { hasNftMinted: !!mintedNft, isLoading }
}
