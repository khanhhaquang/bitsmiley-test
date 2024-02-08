import { getIsCreatingOrder, getTxId } from '@/store/account/reducer'
import { AddressStauts } from '@/types/status'
import { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useStoreActions } from './useStoreActions'
import { useQuery } from 'react-query'
import { useUserInfo } from './useUserInfo'
import imgString from './imgString.json'
import { useUserNfts } from './useUserNfts'
import { UserService } from '@/services/user'
import { ITransactionInfo, MempoolService } from '@/services/mempool'
import { useProjectInfo } from './useProjectInfo'
import { getAddressStatus } from '@/store/addressStatus/reducer'
import { InscriptionParserService } from 'ordpool-parser'

const FETCH_USER_NFTS_INTERVAL = 5000
const FETCH_TRANSACTION_INFO_INTERVAL = 300000

export const useAddressStatus = () => {
  const { isConnected } = useUserInfo()
  const { setAddressStatus } = useStoreActions()
  const txid = useSelector(getTxId)
  const isCreatingOrder = useSelector(getIsCreatingOrder)
  const [isCheckingTxid, setIsCheckingTxid] = useState(true)

  const {
    isNotStarted,
    isReachedTotalMax,
    isLoadingRemainBlock,
    isLoading: isLoadingProjectInfo
  } = useProjectInfo()
  const { hasNftMinted, isLoading: isLoadingUserNfts } = useUserNfts()

  const { isLoadingNfts, isFetchingNfts } = usePollNewNfts()
  const { isLoadingTxnInfo, isFetchingTxnInfo } = usePollTxnInfo()

  const { isLoading: isLoadingTransactions } = useAddressTransactions()

  const isLoading =
    isLoadingNfts ||
    isCheckingTxid ||
    isLoadingUserNfts ||
    isLoadingRemainBlock ||
    isLoadingProjectInfo ||
    isLoadingTxnInfo

  useEffect(() => {
    if (isLoading) {
      setAddressStatus(AddressStauts.CheckingInscription)
      setIsCheckingTxid(false)
      return
    }

    if (!isConnected) {
      if (isReachedTotalMax) {
        setAddressStatus(AddressStauts.MintingEnded)
      } else {
        setAddressStatus(AddressStauts.NotConnected)
      }
      setIsCheckingTxid(false)
      return
    }

    if (hasNftMinted) {
      setAddressStatus(AddressStauts.InscriptionSucceeded)
      setIsCheckingTxid(false)
      return
    }

    if (isReachedTotalMax) {
      setAddressStatus(AddressStauts.MintingEnded)
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
      !isLoading &&
      !isFetchingNfts &&
      !isLoadingTransactions &&
      !isFetchingTxnInfo
    ) {
      setAddressStatus(AddressStauts.NotInscribed)
      setIsCheckingTxid(false)
    }
  }, [
    txid,
    isLoading,
    isConnected,
    hasNftMinted,
    isNotStarted,
    isFetchingNfts,
    isCreatingOrder,
    setAddressStatus,
    isReachedTotalMax,
    isLoadingTransactions,
    isFetchingTxnInfo
  ])

  return { isLoading }
}

const useAddressTransactions = () => {
  const { setTxId } = useStoreActions()
  const { address, isConnected } = useUserInfo()
  const { hasNftMinted, isLoading: isLoadingHasNftMinted } = useUserNfts()
  const [isChecking, setIsChecking] = useState(true)

  const getTargetTxn = useCallback((txns: ITransactionInfo[] | undefined) => {
    if (!txns?.length) return null

    const targetTxn = txns.find((t) => {
      const parsedInscriptions = InscriptionParserService.parse(t)
      const targetInscription = parsedInscriptions?.find(
        (i) => i.getDataUri().toLowerCase() === imgString.base64.toLowerCase()
      )
      return !!targetInscription
    })

    return targetTxn
  }, [])

  const fetchTxns = useCallback(async () => {
    if (!address || hasNftMinted) {
      setIsChecking(false)
      return
    }

    if (isLoadingHasNftMinted) return

    try {
      const res = await MempoolService.getAddressTransactions.call(address)
      const targetTxn = getTargetTxn(res?.data)
      if (targetTxn) {
        setTxId(targetTxn?.txid)
      }
    } catch (e) {
      /* empty */
    } finally {
      setIsChecking(false)
    }
  }, [address, getTargetTxn, hasNftMinted, isLoadingHasNftMinted, setTxId])

  useEffect(() => {
    if (isConnected) {
      fetchTxns()
    } else {
      setIsChecking(true)
    }
  }, [fetchTxns, isConnected])

  return {
    isLoading: isChecking
  }
}

const usePollTxnInfo = () => {
  const txid = useSelector(getTxId)
  const { isConnected } = useUserInfo()

  const { setAddressStatus } = useStoreActions()
  const { hasNftMinted, isLoading: isLoadingHasNftMinted } = useUserNfts()

  const {
    data: txnInfoRes,
    isLoading: isLoadingTxnInfo,
    isFetching: isFetchingTxnInfo,
    isRefetching: isRefetchingTxnInfo
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
        if (res?.response?.status === 404) return FETCH_USER_NFTS_INTERVAL
        return res?.data?.status?.confirmed
          ? false
          : FETCH_TRANSACTION_INFO_INTERVAL
      }
    }
  )

  useEffect(() => {
    if (
      hasNftMinted ||
      !txnInfoRes?.data?.status ||
      !isConnected ||
      isLoadingHasNftMinted
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
    isLoadingHasNftMinted,
    txnInfoRes?.data?.status
  ])

  return {
    isLoadingTxnInfo,
    isFetchingTxnInfo,
    isRefetchingTxnInfo
  }
}

const usePollNewNfts = () => {
  const { address, isConnected } = useUserInfo()
  const { refetch: refetchProjectInfo, isNotStarted } = useProjectInfo()

  const { setAddressStatus, setInscriptionId, setUserNfts } = useStoreActions()

  const txid = useSelector(getTxId)
  const addressStatus = useSelector(getAddressStatus)

  const {
    hasNftMinted,
    getDisbleMinting,
    isLoading: isLoadingHasNftMinted
  } = useUserNfts()

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

  useEffect(() => {
    if (hasNftMinted || isLoadingHasNftMinted || !isConnected) return

    const nfts = nftsData?.data?.data?.nfts

    if (!nfts?.length) return

    refetchProjectInfo()

    setUserNfts(nfts)

    const nftScceed = nfts?.find(
      (n) => !!n?.inscription_id && !n?.invalid_reason
    )
    const nftFailed = nfts?.find((n) => !!n?.invalid_reason)

    if (nftScceed) {
      setInscriptionId(nftScceed.inscription_id)
      setAddressStatus(AddressStauts.InscriptionSucceeded)
      return
    }

    if (isNotStarted) return

    // const disableMinting = getDisbleMinting(nfts)
    const disableMinting = true

    if (disableMinting) {
      setAddressStatus(AddressStauts.DisableMinting)
      return
    }

    if (nftFailed) {
      setAddressStatus(AddressStauts.InscriptionFailed)
    }
  }, [
    setUserNfts,
    isConnected,
    isNotStarted,
    hasNftMinted,
    getDisbleMinting,
    setAddressStatus,
    setInscriptionId,
    isLoadingHasNftMinted,
    refetchProjectInfo,
    nftsData?.data?.data?.nfts
  ])

  return {
    isFetchingNfts,
    isLoadingNfts,
    isRefetchingNfts
  }
}
