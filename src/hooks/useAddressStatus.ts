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
import { getRemainBlock } from '@/store/common/reducer'

const FETCH_USER_NFTS_INTERVAL = 5000
const FETCH_TRANSACTION_INFO_INTERVAL = 300000

export const useAddressStatus = () => {
  const { address, isConnected } = useUserInfo()
  const { setAddressStatus, setInscriptionId } = useStoreActions()

  const txid = useSelector(getTxId)
  const remainBlock = useSelector(getRemainBlock)
  const addressStatus = useSelector(getAddressStatus)
  const isCreatingOrder = useSelector(getIsCreatingOrder)

  const [isCheckingTxid, setIsCheckingTxid] = useState(true)
  const isNotStarted = useMemo(() => remainBlock > 0, [remainBlock])
  const isLoadingRemainBlockNum = useMemo(() => remainBlock < 0, [remainBlock])

  const {
    disableMinting,
    hasNftMinted,
    getDisbleMinting,
    isLoading: isFetchingUserNfts
  } = useUserNfts()

  const { isLoading: isFetchingInscription } = useAddressInscription()

  const {
    data: txnInfoRes,
    isLoading: isLoadingTransactionInfo,
    isFetching: isFetchingTransactionInfo,
    isRefetching: isRefetchingTransactionInfo
  } = useQuery(
    [MempoolService.getTransactionInfo.key, txid, hasNftMinted],
    async () =>
      MempoolService.getTransactionInfo
        .call(txid as string)
        .then((res) => res)
        .catch((e) => e),
    {
      enabled: !!txid && !hasNftMinted,
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
    isFetching: isFetchingNfts,
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

    if (
      isFetchingInscription ||
      isFetchingUserNfts ||
      isLoadingRemainBlockNum
    ) {
      setAddressStatus(AddressStauts.CheckingInscription)
      setIsCheckingTxid(false)
      return
    }

    if (hasNftMinted) {
      setAddressStatus(AddressStauts.InscriptionSucceeded)
      setIsCheckingTxid(false)
      return
    }

    if (disableMinting) {
      setAddressStatus(AddressStauts.Promotion)
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

    if (
      !txid &&
      !isFetchingInscription &&
      !isFetchingUserNfts &&
      !isFetchingTransactionInfo &&
      !isFetchingNfts &&
      !isFetchingInscription &&
      address &&
      !!isConnected
    ) {
      setAddressStatus(AddressStauts.NotInscribed)
      setIsCheckingTxid(false)
    }
  }, [
    txid,
    address,
    isConnected,
    hasNftMinted,
    isNotStarted,
    disableMinting,
    isFetchingNfts,
    isCreatingOrder,
    setAddressStatus,
    isFetchingUserNfts,
    isFetchingInscription,
    isLoadingRemainBlockNum,
    isFetchingTransactionInfo
  ])

  useEffect(() => {
    if (
      hasNftMinted ||
      !txnInfoRes?.data?.status ||
      !isConnected ||
      isFetchingUserNfts
    )
      return

    if (txnInfoRes?.data?.status?.confirmed) {
      setAddressStatus(AddressStauts.InscriptionConfirmed)
    } else {
      setAddressStatus(AddressStauts.Inscribing)
    }
  }, [
    isConnected,
    hasNftMinted,
    setAddressStatus,
    isFetchingUserNfts,
    txnInfoRes?.data?.status
  ])

  useEffect(() => {
    if (hasNftMinted || isFetchingUserNfts || !isConnected) return

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

    const disableMinting = getDisbleMinting(nfts)

    if (disableMinting) {
      setAddressStatus(AddressStauts.Promotion)
      return
    }

    if (nftFailed) {
      setAddressStatus(AddressStauts.InscriptionFailed)
    }
  }, [
    isConnected,
    hasNftMinted,
    setInscriptionId,
    getDisbleMinting,
    setAddressStatus,
    isFetchingUserNfts,
    nftsData?.data?.data?.nfts
  ])

  return { isLoading }
}
