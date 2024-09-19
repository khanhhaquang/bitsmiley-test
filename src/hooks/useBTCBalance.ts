import { useCallback, useEffect, useMemo, useState } from 'react'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { getLocalStorage } from '@/utils/storage'
import { useAccount } from 'wagmi'

export const useBTCBalance = (walletAddress?: string) => {
  const [balance, setBalance] = useState<bigint>(BigInt(0))
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
      setBalance(BigInt(okxBalance?.total || 0))
    } catch (e) {
      console.log(e)
    }
  }

  const getMempoolBalance = async () => {
    // will update with mempool.js
  }

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
        getMempoolBalance()
        break
      default: {
        break
      }
    }
  }, [localLoginType, isMainnet, walletAddress])

  useEffect(() => {
    getBTCWallet()
  }, [getBTCWallet])

  return { balance }
}
