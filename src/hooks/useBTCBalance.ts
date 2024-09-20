import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useCallback, useEffect, useState } from 'react'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { satsToBTC } from '@/utils/formatter'
import { getLocalStorage } from '@/utils/storage'

export const useBTCBalance = () => {
  const { accounts, provider } = useBTCProvider()

  const [balance, setBalance] = useState(0)

  const btcLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.BTC_LOGIN_TYPE)

  const getOkxBalance = async () => {
    try {
      const okxBalance = await provider?.getBalance()
      return okxBalance?.total
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const getBybitBalance = async () => {
    try {
      const bybitBalance = await window?.bybitWallet?.bitcoin?.getBalance()
      return bybitBalance?.total
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const getBitgetBalance = async () => {
    try {
      const bitgetBalance = await window?.bitkeep?.unisat?.getBalance()
      return bitgetBalance?.total
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const getUnisatBalance = async () => {
    try {
      const unisatBalance = await provider?.getBalance()
      console.log('🚀 ~ getUnisatBalance ~ unisatBalance:', unisatBalance)
      return unisatBalance?.total
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const getXverseBalance = async () => {
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
      return xverseBalance?.result?.total
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const getBalance = useCallback(async () => {
    if (!accounts?.length) return // not connect btc yet
    let total = 0
    switch (btcLoginType) {
      case LoginType.OKX: {
        total = await getOkxBalance()
        break
      }
      case LoginType.BYBIT: {
        total = await getBybitBalance()
        break
      }
      case LoginType.BITGET: {
        total = await getBitgetBalance()
        break
      }
      case LoginType.UNISAT:
        total = await getUnisatBalance()
        break
      case LoginType.XVERSE:
        total = await getXverseBalance()
        break
      default: {
        break
      }
    }
    setBalance(total || 0)
  }, [accounts?.length, btcLoginType])

  useEffect(() => {
    getBalance()
  }, [getBalance])

  return {
    getBalance,
    balanceAsSats: balance,
    balanceAsBtc: satsToBTC(balance)
  }
}
