import { INft, InvalidReasonEnum, UserService } from '@/services/user'
import { useQuery } from 'react-query'
import { useUserInfo } from './useUserInfo'
import { useCallback, useEffect, useMemo } from 'react'
import { useStoreActions } from './useStoreActions'
import { useProjectInfo } from './useProjectInfo'

export const useUserNfts = () => {
  const { setTxId, setInscriptionId } = useStoreActions()
  const { isDuringWhitelist } = useProjectInfo()
  const { address } = useUserInfo()

  const { data: nftsDataRes, isLoading } = useQuery(
    [UserService.getNFTs.key, address],
    () => UserService.getNFTs.call(address),
    {
      enabled: !!address
    }
  )

  const getDisbleMinting = useCallback(
    (nfts?: INft[]) => {
      if (!nfts?.length) return false

      if (isDuringWhitelist) {
        return !!nfts.some(
          (n) =>
            !!n.inscription_id &&
            !!n.invalid_reason &&
            n.invalid_reason !== InvalidReasonEnum.NotStarted
        )
      }

      return !!nfts.some(
        (n) =>
          !!n.inscription_id &&
          !!n.invalid_reason &&
          n.invalid_reason !== InvalidReasonEnum.NotStarted &&
          n.invalid_reason !== InvalidReasonEnum.WhitelistMaxCountReached &&
          n.invalid_reason !== InvalidReasonEnum.NotWhitelisted
      )
    },
    [isDuringWhitelist]
  )

  const mintedNft = useMemo(
    () =>
      nftsDataRes?.data?.data?.nfts?.find(
        (n) => !!n.inscription_id && !n.invalid_reason
      ),
    [nftsDataRes]
  )

  const disableMinting = useMemo(
    () => getDisbleMinting(nftsDataRes?.data?.data?.nfts),
    [getDisbleMinting, nftsDataRes?.data?.data?.nfts]
  )

  useEffect(() => {
    if (mintedNft) {
      setTxId(mintedNft.txid)
      setInscriptionId(mintedNft.inscription_id)
      return
    }
  }, [mintedNft, setInscriptionId, setTxId])

  return {
    disableMinting,
    hasNftMinted: !!mintedNft,
    isLoading,
    getDisbleMinting
  }
}
