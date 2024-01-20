import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import {
  getAddressStatus,
  getIsCreatingOrder,
  getTxId
} from '@/store/account/reducer'
import { AddressStauts } from '@/types/status'
import { deleteLocalStorage, getLocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useStoreActions } from './useStoreActions'
import { useQuery } from 'react-query'
import { useProjectInfo } from './useProjectInfo'
import { useUserInfo } from './useUserInfo'
import { useUserNfts } from './useUserNfts'
import { UserService } from '@/services/user'
import { MempoolService } from '@/services/mempool'

const enableInscription =
  getLocalStorage(LOCAL_STORAGE_KEYS.ENABLE_INSCRIBE) === 'true'

export const useAddressStatus = () => {
  const txid = useSelector(getTxId)
  const { hasNftMinted } = useUserNfts()
  const addressStatus = useSelector(getAddressStatus)
  const isCreatingOrder = useSelector(getIsCreatingOrder)
  const { address, isConnected, isWhitelist } = useUserInfo()
  const { setTxId, setAddressStatus } = useStoreActions()
  const [isCheckingTxid, setIsCheckingTxid] = useState(true)
  const { whitelistRemainTime, normalRemainTime } = useProjectInfo()

  const {
    data: txnInfoRes,
    isLoading: isLoadingTransactionInfo,
    isRefetching: isRefetchingTransactionInfo
  } = useQuery(
    [MempoolService.getTransactionInfo.key, txid],
    () =>
      MempoolService.getTransactionInfo
        .call(txid)
        .then((res) => res)
        .catch((e) => e),
    {
      enabled: !!txid,
      refetchInterval: (res) => {
        if (!res) return false
        return res?.data?.data?.status?.confirmed ? false : 1000 * 60 * 5
      }
    }
  )

  const {
    data: nftsData,
    isLoading: isLoadingNfts,
    isRefetching: isRefetchingNfts
  } = useQuery(
    [UserService.getNFTs.key, address, addressStatus],
    () => UserService.getNFTs.call(address),
    {
      enabled:
        !!address && addressStatus === AddressStauts.InscriptionConfirmed,
      refetchInterval: (res) =>
        res?.data?.data?.nfts?.length ? false : 1000 * 5
    }
  )

  const isLoading =
    isCheckingTxid ||
    (isLoadingTransactionInfo && !isRefetchingTransactionInfo) ||
    (isLoadingNfts && !isRefetchingNfts)

  useEffect(() => {
    if (!enableInscription) {
      setAddressStatus(AddressStauts.Promotion)
      setIsCheckingTxid(false)
      return
    }

    if (!isConnected) {
      setAddressStatus(AddressStauts.NotConnected)
      setIsCheckingTxid(false)
      return
    }

    if (hasNftMinted) {
      setAddressStatus(AddressStauts.InscriptionSucceeded)
      setIsCheckingTxid(false)
      return
    }

    if (isWhitelist && whitelistRemainTime > 0) {
      setAddressStatus(AddressStauts.NotStarted)
      setIsCheckingTxid(false)
      return
    }

    if (!isWhitelist && normalRemainTime > 0) {
      setAddressStatus(AddressStauts.NotStarted)
      setIsCheckingTxid(false)
      return
    }

    if (isCreatingOrder) {
      setAddressStatus(AddressStauts.Inscribing)
      setIsCheckingTxid(false)
      return
    }

    const localTxId = getLocalStorage(LOCAL_STORAGE_KEYS.TXID)

    if (!localTxId || localTxId === 'undefined') {
      setAddressStatus(AddressStauts.NotInscribed)
      setIsCheckingTxid(false)
      return
    }

    if (!!localTxId && localTxId !== 'undefined' && !txid) {
      setTxId(localTxId)
      setIsCheckingTxid(false)
      return
    }
  }, [
    hasNftMinted,
    isConnected,
    isCreatingOrder,
    isWhitelist,
    normalRemainTime,
    setAddressStatus,
    setTxId,
    txid,
    whitelistRemainTime
  ])

  useEffect(() => {
    if (!txnInfoRes?.data?.data?.status || !isConnected) return

    if (txnInfoRes?.data?.data?.status?.confirmed) {
      setAddressStatus(AddressStauts.InscriptionConfirmed)
    } else {
      setAddressStatus(AddressStauts.Inscribing)
    }
  }, [txnInfoRes?.data?.data, isConnected, setAddressStatus])

  useEffect(() => {
    const nfts = nftsData?.data?.data?.nfts

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
  }, [nftsData?.data, setAddressStatus])

  useEffect(() => {
    // txid invalid
    if (txnInfoRes?.response?.status === 400) {
      setTxId('')
      deleteLocalStorage(LOCAL_STORAGE_KEYS.TXID)
    }
  }, [setTxId, txnInfoRes?.response?.status])

  return { isLoading }
}
