import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useCallback } from 'react'

import { isBtcTaprootAddress } from '@/utils/chain'

import { useMempool } from './useMempool'

export const useNativeBtcProvider = () => {
  const MempoolService = useMempool()
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
    [MempoolService.postTransaction, accounts.length, provider]
  )

  const customSignMessage = useCallback(
    async (message: string) => {
      if (provider && accounts.length > 0) {
        try {
          const signature = await provider.signMessage(
            message,
            isBtcTaprootAddress(accounts[0] && 'bip322-simple')
          )
          return signature
        } catch (e) {
          console.log('sign message error: ', e)
        }
      }
    },
    [accounts, provider]
  )

  return {
    customSignMessage,
    pushTx,
    getNetwork,
    provider,
    accounts,
    ...rest
  }
}
