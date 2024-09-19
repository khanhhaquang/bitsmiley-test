import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { satsToBTC } from '@/utils/formatter'
import { getLocalStorage } from '@/utils/storage'

export const useBTCBalance = () => {
  const [balance, setBalance] = useState<number>(0) // btc
  const localLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)
  const { chain } = useAccount()
  const isMainnet = useMemo(() => chain && !chain.testnet, [chain])

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

  const getBTCWallet = useCallback(async () => {
    if (!chain) return
    let total = 0
    switch (localLoginType) {
      case LoginType.OKX_EVM: {
        total = await getOKXBTCBalance()
        break
      }
      case LoginType.BYBIT_EVM: {
        total = await getBybitBalance()
        break
      }
      case LoginType.BITGET_EVM:
        total = await getBitgetBalance()
        break
      default: {
        break
      }
    }
    setBalance(satsToBTC(total || 0))
  }, [localLoginType, isMainnet, chain])

  useEffect(() => {
    getBTCWallet()
  }, [getBTCWallet])

  return { balance }
}
