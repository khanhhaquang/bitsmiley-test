import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useQuery } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useNativeBtcProvider = () => {
  const { accounts, provider, getNetwork, ...rest } = useBTCProvider()

  const pushTx = useCallback(
    async (rawTx: string) => {
      if (provider && accounts.length > 0)
        try {
          const txn = await provider?.pushTx(rawTx)
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
