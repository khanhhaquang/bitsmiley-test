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

const FETCH_USER_NFTS_INTERVAL = 5000
const FETCH_TRANSACTION_INFO_INTERVAL = 300000

export const useAddressStatus = () => {
  const txid = useSelector(getTxId)
  const { isLoading: isFetchingInscription } = useAddressInscription()
  const { hasNftMinted, isLoading: isFetchingUserNfts } = useUserNfts()
  const addressStatus = useSelector(getAddressStatus)
  const isCreatingOrder = useSelector(getIsCreatingOrder)
  const { address, isConnected, isWhitelist } = useUserInfo()
  const { setRemainCountdown, setAddressStatus, setInscriptionId } =
    useStoreActions()
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
    [MempoolService.getTransactionInfo.key, txid, addressStatus, hasNftMinted],
    () =>
      MempoolService.getTransactionInfo
        .call(txid as string)
        .then((res) => res)
        .catch((e) => e),
    {
      enabled:
        !!txid && addressStatus === AddressStauts.Inscribing && !hasNftMinted,
      refetchInterval: (res) => {
        if (!res) return false
        return res?.data?.status?.confirmed
          ? false
          : FETCH_TRANSACTION_INFO_INTERVAL
      }
    }
  )

  const {
    data: nftsData,
    isLoading: isLoadingNfts,
    isRefetching: isRefetchingNfts
  } = useQuery(
    [UserService.getNFTs.key, txid, address, addressStatus, hasNftMinted],
    () => UserService.getNFTs.call(address),
    {
      enabled:
        !!txid &&
        !!address &&
        addressStatus === AddressStauts.InscriptionConfirmed &&
        !hasNftMinted,
      refetchInterval: (res) =>
        res?.data?.data?.nfts?.length ? false : FETCH_USER_NFTS_INTERVAL
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
      setInscriptionId(nftScceed.inscription_id)
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
    setAddressStatus,
    setInscriptionId
  ])

  return { isLoading }
}
