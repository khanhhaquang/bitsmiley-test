import {
  getAddressStatus,
  getIsCreatingOrder,
  getTxId
} from '@/store/account/reducer'
import { AddressStauts } from '@/types/status'
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { useStoreActions } from './useStoreActions'
import { useQuery } from 'react-query'
import { useUserInfo } from './useUserInfo'
import { useUserNfts } from './useUserNfts'
import { UserService } from '@/services/user'
import { MempoolService } from '@/services/mempool'
import { useAddressInscription } from './useAddressInscription'
import { getRemainCountdown } from '@/store/common/reducer'
import { useCountdown } from './useCountdown'
import { useProjectInfo } from './useProjectInfo'

export const useAddressStatus = () => {
  const txid = useSelector(getTxId)
  const { isLoading: isFetchingInscription } = useAddressInscription()
  const { hasNftMinted, isLoading: isFetchingUserNfts } = useUserNfts()
  const addressStatus = useSelector(getAddressStatus)
  const isCreatingOrder = useSelector(getIsCreatingOrder)
  const { address, isConnected, isWhitelist } = useUserInfo()
  const { setRemainCountdown, setAddressStatus } = useStoreActions()
  const [isCheckingTxid, setIsCheckingTxid] = useState(true)
  const remainCountdown = useSelector(getRemainCountdown)
  const { remainTime } = useProjectInfo()
  const isNotStarted = useMemo(() => remainCountdown > 0, [remainCountdown])

  const [count] = useCountdown({
    countStart: remainTime
  })

  useEffect(() => {
    if (count >= 0) setRemainCountdown(count)
  }, [count, setRemainCountdown])

  const {
    data: txnInfoRes,
    isLoading: isLoadingTransactionInfo,
    isRefetching: isRefetchingTransactionInfo
  } = useQuery(
    [MempoolService.getTransactionInfo.key, txid, hasNftMinted],
    () =>
      MempoolService.getTransactionInfo
        .call(txid as string)
        .then((res) => res)
        .catch((e) => e),
    {
      enabled: !!txid && !hasNftMinted,
      refetchInterval: (res) => {
        if (!res) return false
        return res?.data?.status?.confirmed ? false : 1000 * 60
      }
    }
  )

  const {
    data: nftsData,
    isLoading: isLoadingNfts,
    isRefetching: isRefetchingNfts
  } = useQuery(
    [UserService.getNFTs.key, address, addressStatus, hasNftMinted],
    () => UserService.getNFTs.call(address),
    {
      enabled:
        !!address &&
        addressStatus === AddressStauts.InscriptionConfirmed &&
        !hasNftMinted,
      refetchInterval: (res) =>
        res?.data?.data?.nfts?.length ? false : 1000 * 5
    }
  )

  const isLoading =
    isCheckingTxid ||
    (isLoadingTransactionInfo && !isRefetchingTransactionInfo) ||
    (isLoadingNfts && !isRefetchingNfts)

  useEffect(() => {
    if (!isConnected) {
      setAddressStatus(AddressStauts.NotConnected)
      setIsCheckingTxid(false)
      return
    }

    if (isFetchingInscription || isFetchingUserNfts) {
      setAddressStatus(AddressStauts.CheckingInscription)
      setIsCheckingTxid(false)
      return
    }

    if (hasNftMinted) {
      setAddressStatus(AddressStauts.InscriptionSucceeded)
      setIsCheckingTxid(false)
      return
    }

    if (isNotStarted) {
      setAddressStatus(AddressStauts.NotStarted)
      setIsCheckingTxid(false)
      return
    }

    if (isCreatingOrder) {
      setAddressStatus(AddressStauts.Inscribing)
      setIsCheckingTxid(false)
      return
    }

    if (!txid && !isFetchingInscription) {
      setAddressStatus(AddressStauts.NotInscribed)
      setIsCheckingTxid(false)
    }
  }, [
    hasNftMinted,
    isConnected,
    isCreatingOrder,
    isFetchingInscription,
    isWhitelist,
    isNotStarted,
    setAddressStatus,
    txid,
    isFetchingUserNfts
  ])

  useEffect(() => {
    if (hasNftMinted || isFetchingUserNfts) return

    if (!txnInfoRes?.data?.status || !isConnected) return

    if (txnInfoRes?.data?.status?.confirmed) {
      setAddressStatus(AddressStauts.InscriptionConfirmed)
    } else {
      setAddressStatus(AddressStauts.Inscribing)
    }
  }, [
    hasNftMinted,
    isConnected,
    isFetchingUserNfts,
    setAddressStatus,
    txnInfoRes?.data?.status
  ])

  useEffect(() => {
    if (hasNftMinted || isFetchingUserNfts) return

    const nfts = nftsData?.data?.data?.nfts

    if (!nfts?.length) return

    const nftScceed = nfts?.find(
      (n) => !!n?.inscription_id && !n?.invalid_reason
    )
    const nftFailed = nfts?.find((n) => !!n?.invalid_reason)

    if (nftScceed) {
      setAddressStatus(AddressStauts.InscriptionSucceeded)
      return
    }

    if (nftFailed) {
      setAddressStatus(AddressStauts.InscriptionFailed)
    }
  }, [
    hasNftMinted,
    isFetchingUserNfts,
    nftsData?.data?.data?.nfts,
    setAddressStatus
  ])

  return { isLoading }
}
