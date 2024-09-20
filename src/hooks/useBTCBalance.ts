import { useBTCProvider } from '@particle-network/btc-connectkit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { satsToBTC } from '@/utils/formatter'
import { getLocalStorage } from '@/utils/storage'

export const useBTCBalance = () => {
  const [balance, setBalance] = useState<number>(0) // btc
  const btcLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.BTC_LOGIN_TYPE)
  const { chain } = useAccount()
  const { accounts, provider } = useBTCProvider()

  const isMainnet = useMemo(() => chain && !chain.testnet, [chain]) // temporary solution

  const getOKXBTCBalance = async () => {
    try {
      let okxBalance
      if (isMainnet) {
        okxBalance = await window?.okxwallet?.bitcoin?.getBalance()
      } else {
        okxBalance = await window.okxwallet.bitcoinTestnet.getBalance()
      }
      return okxBalance?.total
    } catch (e) {
      console.log(e)
      return 0
    }
  }

  const getBybitBalance = async () => {
    try {
      if (isMainnet) {
        // bybit only support mainnet
        const bybitBalance = await window?.bybitWallet?.bitcoin?.getBalance()
        return bybitBalance?.total
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getBitgetBalance = async () => {
    try {
      const bitgetBalance = await window?.bitkeep?.unisat?.getBalance()
      return bitgetBalance?.total
    } catch (e) {
      console.log(e)
    }
  }

  const getUnisatBalance = async () => {
    try {
      const unisatBalance = await window?.unisat?.getBalance()
      return unisatBalance?.total
    } catch (e) {
      console.log(e)
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
    }
  }

  const getBTCWallet = useCallback(async () => {
    if (!accounts?.length) return
    let total = 0
    switch (btcLoginType) {
      case LoginType.OKX: {
        total = await getOKXBTCBalance()
        break
      }
      case LoginType.BYBIT: {
        total = await getBybitBalance()
        break
      }
      case LoginType.BITGET:
        total = await getBitgetBalance()
        break
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
    setBalance(satsToBTC(total || 0))
  }, [btcLoginType, accounts])

  useEffect(() => {
    getBTCWallet()
  }, [getBTCWallet])

  return { balance }
}
