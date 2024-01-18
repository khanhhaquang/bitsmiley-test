import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { UnisatService } from '@/services/unisat'
import { getTxId } from '@/store/account/reducer'
import { InscribeStatus } from '@/types/status'
import { deleteLocalStorage, getLocalStorage } from '@/utils/storage'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useStoreActions } from './useStoreActions'
import { useQuery } from 'react-query'
import { useProjectInfo } from './useProjectInfo'
import { useUserInfo } from './useUserInfo'

const enableInscription =
  getLocalStorage(LOCAL_STORAGE_KEYS.ENABLE_INSCRIBE) === 'true'

export const useInscriptionStatus = () => {
  const txid = useSelector(getTxId)
  const { isConnected } = useUserInfo()
  const { setTxId, setInscriptionStatus } = useStoreActions()
  const [isCheckingTxid, setIsCheckingTxid] = useState(true)
  const { remainTime } = useProjectInfo()

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
      setInscriptionStatus(InscribeStatus.Promotion)
      setIsCheckingTxid(false)
      return
    }

    if (!isConnected) {
      setInscriptionStatus(InscribeStatus.NotConnected)
      setIsCheckingTxid(false)
      return
    }

    if (remainTime > 0) {
      setInscriptionStatus(InscribeStatus.NotStarted)
      setIsCheckingTxid(false)
      return
    }

    const localTxId = getLocalStorage(LOCAL_STORAGE_KEYS.TXID)

    if (!localTxId || localTxId === 'undefined') {
      setInscriptionStatus(InscribeStatus.NotInscribed)
      setIsCheckingTxid(false)
      return
    }

    if (!!localTxId && localTxId !== 'undefined' && !txid) {
      setTxId(localTxId)
      setIsCheckingTxid(false)
      return
    }
  }, [isConnected, remainTime, setInscriptionStatus, setTxId, txid])

  useEffect(() => {
    if (!txnInfoRes?.data?.data || !isConnected) return

    if (txnInfoRes?.data?.data?.confirmations) {
      setInscriptionStatus(InscribeStatus.InscriptionSucceeded)
    } else {
      setInscriptionStatus(InscribeStatus.Inscribing)
    }
  }, [txnInfoRes?.data?.data, setInscriptionStatus, isConnected])

  useEffect(() => {
    // txid invalid
    if (txnInfoRes?.data?.code === -1) {
      setTxId('')
      deleteLocalStorage(LOCAL_STORAGE_KEYS.TXID)
    }
  }, [setTxId, txnInfoRes?.data?.code])

  return { isLoading }
}
