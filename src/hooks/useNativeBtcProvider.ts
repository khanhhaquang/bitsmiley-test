import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

import { MempoolService } from '@/services/mempool'

export const useNativeBtcProvider = () => {
  const { accounts, provider, getNetwork, ...rest } = useBTCProvider()

  const pushTx = useCallback(
    async (rawTx: string) => {
      if (provider && accounts.length > 0)
        try {
          const caller = provider?.pushTx || MempoolService.postTransaction.call
          let txn = ''
          txn = await caller(rawTx)

          if (!txn) {
            txn = await MempoolService.postTransaction.call(rawTx)
          }

          return txn
        } catch (e) {
          console.log(e)
        }
    },
    [accounts.length, provider]
  )

  const { data: btcNetwork, refetch: getNetworkRefetch } = useQuery({
    queryKey: ['btc-connected-network', accounts[0]],
    queryFn: () => getNetwork()
  })

  return {
    pushTx,
    btcNetwork,
    getNetworkRefetch,
    getNetwork,
    provider,
    accounts,
    ...rest
  }
}
