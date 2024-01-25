import { INft, InvalidReasonEnum, UserService } from '@/services/user'
import { useQuery } from 'react-query'
import { useUserInfo } from './useUserInfo'
import { useCallback, useEffect, useMemo } from 'react'
import { useStoreActions } from './useStoreActions'
import { useProjectInfo } from './useProjectInfo'
import { useSelector } from 'react-redux'
import { getUserNfts } from '@/store/account/reducer'

export const useUserNfts = () => {
  const { address } = useUserInfo()
  const { isDuringWhitelist } = useProjectInfo()

  const userNfts = useSelector(getUserNfts)
  const { setTxId, setInscriptionId, setUserNfts } = useStoreActions()

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

  useEffect(() => {
    if (mintedNft) {
      setTxId(mintedNft.txid)
      setInscriptionId(mintedNft.inscription_id)
      return
    }
  }, [mintedNft, setInscriptionId, setTxId])

  useEffect(() => {
    const nfts = nftsDataRes?.data?.data?.nfts

    if (!userNfts.length && !!nfts?.length) {
      setUserNfts(nfts || [])
    }
  }, [nftsDataRes, setUserNfts, userNfts])

  return {
    hasNftMinted: !!mintedNft,
    isLoading,
    getDisbleMinting
  }
}
