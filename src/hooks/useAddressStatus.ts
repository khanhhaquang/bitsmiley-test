import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { UnisatService } from '@/services/unisat'
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
    [UnisatService.getTransactionInfo.key, txid],
    () => UnisatService.getTransactionInfo.call(txid),
    {
      enabled: !!txid,
      refetchInterval: (res) => {
        if (res?.data?.code === -1) return 1000 * 5
        return res?.data?.data?.confirmations ? false : 1000 * 60 * 5
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
      refetchInterval: (res) => (res?.data?.length ? false : 1000 * 5)
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
    if (!txnInfoRes?.data?.data || !isConnected) return

    if (txnInfoRes?.data?.data?.confirmations) {
      setAddressStatus(AddressStauts.InscriptionConfirmed)
    } else {
      setAddressStatus(AddressStauts.Inscribing)
    }
  }, [txnInfoRes?.data?.data, isConnected, setAddressStatus])

  useEffect(() => {
    const nftScceed = nftsData?.data?.find(
      (n) => !!n?.inscription_id && !n?.invalid_reason
    )
    const nftFailed = nftsData?.data?.find((n) => !!n?.invalid_reason)

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
    if (txnInfoRes?.data?.msg === 'txid invalid') {
      setTxId('')
      deleteLocalStorage(LOCAL_STORAGE_KEYS.TXID)
    }
  }, [setTxId, txnInfoRes?.data?.msg])

  return { isLoading }
}
