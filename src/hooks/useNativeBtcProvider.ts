import { useBTCProvider } from '@particle-network/btc-connectkit'
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

  return {
    pushTx,
    getNetwork,
    provider,
    accounts,
    ...rest
  }
}
