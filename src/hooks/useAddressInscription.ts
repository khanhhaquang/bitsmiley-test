import { ITransactionInfo, MempoolService } from '@/services/mempool'
import { useUserInfo } from './useUserInfo'
import { InscriptionParserService } from 'ordpool-parser'
import { useStoreActions } from './useStoreActions'
import imgString from './imgString.json'
import { useCallback, useEffect, useState } from 'react'
import { useUserNfts } from './useUserNfts'

export const useAddressInscription = () => {
  const { address } = useUserInfo()
  const { hasNftMinted, isLoading: isFetchingUserNfts } = useUserNfts()
  const { setTxId } = useStoreActions()
  const [isChecking, setIsChecking] = useState(true)

  const getTargetTxn = useCallback((txns: ITransactionInfo[] | undefined) => {
    if (!txns?.length) return null

    const targetTxn = txns
      .sort((a, b) => a.status.block_time - b.status.block_time)
      .find((t) => {
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

    if (isFetchingUserNfts) return

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
  }, [address, getTargetTxn, hasNftMinted, isFetchingUserNfts, setTxId])

  useEffect(() => {
    fetchTxns()
  }, [fetchTxns])

  return {
    isLoading: isChecking
  }
}
