import mempoolJS from '@mempool/mempool.js'
import { useCallback, useMemo } from 'react'

export const useMempool = () => {
  const {
    bitcoin: { fees, transactions }
  } = useMemo(
    () =>
      mempoolJS({
        hostname: 'mempool.space',
        network: 'testnet'
      }),
    []
  )

  const getFeesRecommended = useCallback(async () => {
    return await fees.getFeesRecommended()
  }, [])

  const getTransaction = useCallback(async (txid: string) => {
    return await transactions.getTx({ txid })
  }, [])

  return {
    getFeesRecommended,
    getTransaction
  }
}
