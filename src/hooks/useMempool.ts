import mempoolJS from '@mempool/mempool.js'
import { useMemo } from 'react'

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

  return {
    fees,
    transactions
  }
}
