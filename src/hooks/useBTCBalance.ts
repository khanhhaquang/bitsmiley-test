import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useQuery } from '@tanstack/react-query'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { satsToBTC } from '@/utils/formatter'
import { getLocalStorage } from '@/utils/storage'

export const useBTCBalance = () => {
  const { accounts, provider } = useBTCProvider()

  const btcLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.BTC_LOGIN_TYPE)

  const getCommonWalletsBalance = async (): Promise<number> => {
    try {
      const result = await provider?.getBalance()
      return result?.total ?? 0
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const getXverseBalance = async (): Promise<number> => {
    try {
      let xverseBalance = await provider.request('getBalance', undefined)
      if (xverseBalance.status === 'error') {
        // Retry with requestPermission
        const retryRequest = await provider.request(
          'wallet_requestPermissions',
          undefined
        )
        if (retryRequest.status !== 'error') {
          xverseBalance = await provider.request('getBalance', undefined)
        }
      }
      return xverseBalance?.result?.total ?? 0
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const getBalance = async () => {
    if (!accounts?.length) return 0 // not connect btc yet
    switch (btcLoginType) {
      case LoginType.XVERSE:
        return await getXverseBalance()
      default: {
        return await getCommonWalletsBalance()
      }
    }
  }

  const { data: balance, refetch: getBalanceRequest } = useQuery({
    queryKey: ['btc-balance', btcLoginType, accounts?.[0]],
    queryFn: () => getBalance()
  })

  return {
    getBalanceRequest,
    balanceAsSats: balance,
    balanceAsBtc: satsToBTC(balance ?? 0)
  }
}
