import { useCallback, useEffect, useMemo, useState } from 'react'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { isTestnet } from '@/utils/chain'
import { getLocalStorage } from '@/utils/storage'

export const useBTCBalance = (chainId?: number, walletAddress?: string) => {
  const [balance, setBalance] = useState<bigint>(BigInt(0))
  const localLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)
  const isMainnet = useMemo(() => chainId && !isTestnet(chainId), [chainId])

  const getOKXBTCBalance = async () => {
    try {
      let okxBalance
      if (isMainnet) {
        okxBalance = await window?.okxwallet?.bitcoin?.getBalance()
      } else {
        okxBalance = await window.okxwallet.bitcoinTestnet.getBalance()
      }
      setBalance(BigInt(okxBalance?.total || 0))
    } catch (e) {
      console.log(e)
    }
  }

  const getMetamaskBalance = async () => {}

  const getBybitBalance = async () => {
    try {
      if (isMainnet) {
        // bybit only support mainnet
        const okxBalance = await window?.bybitWallet?.bitcoin?.getBalance()
        setBalance(BigInt(okxBalance?.total || 0))
      }
    } catch (e) {
      console.log(e)
    }
  }

  const getBitgetBalance = async () => {
    try {
      const bitgetBalance = await window?.bitkeep?.unisat?.getBalance()
      setBalance(BigInt(bitgetBalance?.total || 0))
    } catch (e) {
      console.log(e)
    }
  }

  const getBTCWallet = useCallback(() => {
    if (!walletAddress) return

    switch (localLoginType) {
      case LoginType.OKX_EVM: {
        getOKXBTCBalance()
        break
      }
      case LoginType.BYBIT_EVM: {
        getBybitBalance()
        break
      }
      case LoginType.BITGET_EVM:
        getBitgetBalance()
        break
      case LoginType.METAMASK:
        getMetamaskBalance()
        break
      default: {
        break
      }
    }
  }, [localLoginType, isMainnet, walletAddress])

  useEffect(() => {
    getBTCWallet()
  }, [getBTCWallet])

  console.log('balance', balance)
  return { balance }
}
