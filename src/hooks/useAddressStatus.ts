import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { UnisatService } from '@/services/unisat'
import { getIsCreatingOrder, getTxId } from '@/store/account/reducer'
import { AddressStauts } from '@/types/status'
import { deleteLocalStorage, getLocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useStoreActions } from './useStoreActions'
import { useQuery } from 'react-query'
import { useProjectInfo } from './useProjectInfo'
import { useUserInfo } from './useUserInfo'

const enableInscription =
  getLocalStorage(LOCAL_STORAGE_KEYS.ENABLE_INSCRIBE) === 'true'

export const useAddressStatus = () => {
  const txid = useSelector(getTxId)
  const isCreatingOrder = useSelector(getIsCreatingOrder)
  const { isConnected, isWhitelist } = useUserInfo()
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
      refetchInterval: (res) =>
        res?.data?.data?.confirmations ? false : 1000 * 60 * 5
    }
  )

  const isLoading =
    isCheckingTxid || (isLoadingTransactionInfo && !isRefetchingTransactionInfo)

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
      setAddressStatus(AddressStauts.InscriptionSucceeded)
    } else {
      setAddressStatus(AddressStauts.Inscribing)
    }
  }, [txnInfoRes?.data?.data, isConnected, setAddressStatus])

  useEffect(() => {
    // txid invalid
    if (txnInfoRes?.data?.code === -1) {
      setTxId('')
      deleteLocalStorage(LOCAL_STORAGE_KEYS.TXID)
    }
  }, [setTxId, txnInfoRes?.data?.code])

  return { isLoading }
}
