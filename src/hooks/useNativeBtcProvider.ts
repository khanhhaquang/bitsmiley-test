import { useBTCProvider } from '@particle-network/btc-connectkit'

export const useNativeBtcProvider = () => {
  const { accounts, provider, getNetwork, ...rest } = useBTCProvider()

  const pushTx = async (rawTx: string) => {
    if (provider && accounts.length > 0)
      try {
        const txn = await provider?.pushTx(rawTx)
        return txn
      } catch (e) {
        console.log(e)
      }
  }

  return {
    pushTx,
    getNetwork,
    provider,
    ...rest
  }
}
