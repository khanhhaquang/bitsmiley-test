import { ITransactionInfo, MempoolService } from '@/services/mempool'
import { useUserInfo } from './useUserInfo'
import { InscriptionParserService } from 'ordpool-parser'
import { useStoreActions } from './useStoreActions'
import imgString from './imgString.json'
import { useCallback, useEffect, useState } from 'react'

export const useAddressInscription = () => {
  const { address } = useUserInfo()
  const { setTxId } = useStoreActions()
  const [isChecking, setIsChecking] = useState(true)

  const getTargetTxn = (txns: ITransactionInfo[] | undefined) => {
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
  }

  const fetchTxns = useCallback(async () => {
    try {
      const res = await MempoolService.getAddressTransactions.call(address)
      const targetTxn = getTargetTxn(res.data)
      setTxId(targetTxn?.txid)
    } catch (e) {
      setTxId('')
    } finally {
      setIsChecking(false)
    }
  }, [address, setTxId])

  useEffect(() => {
    if (!address) return
    fetchTxns()
  }, [address, fetchTxns])

  return {
    isLoading: isChecking
  }
}
