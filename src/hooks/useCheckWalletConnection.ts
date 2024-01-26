import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginTypeEnum } from '@/types/common'
import {
  clearConfirmedMinted,
  clearLoginType,
  getLocalStorage
} from '@/utils/storage'
import { useCallback, useEffect, useState } from 'react'
import { useStoreActions } from './useStoreActions'
import { useUserInfo } from './useUserInfo'
import { validateTaprootAddress } from '@/utils/btc'

export const useCheckWalletConnection = () => {
  const [isFetchingAccountsInfo, setIsFetchingAccountsInfo] = useState(true)
  const [isWalletConnected, setIsWalletConnected] = useState<
    boolean | undefined
  >()
  const { resetStorage, setAccountInfo } = useStoreActions()
  const localLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)
  const { isConnected } = useUserInfo()

  const isLoading = isWalletConnected === undefined || isFetchingAccountsInfo

  const clearConnectedInfo = useCallback(() => {
    resetStorage()
    clearLoginType()
    clearConfirmedMinted()
  }, [resetStorage])

  const fetchAccountInfo = useCallback(async () => {
    if (localLoginType === LoginTypeEnum.OKX) {
      try {
        const accounts = await window?.okxwallet?.bitcoin.getAccounts()
        const publicKey = await window?.okxwallet?.bitcoin.getPublicKey()

        if (!validateTaprootAddress(accounts?.[0])) return

        setAccountInfo({
          address: accounts?.[0],
          publicKey
        })
      } catch (error) {
        console.error('fetch okx accounts info error')
      } finally {
        setIsFetchingAccountsInfo(false)
      }
      return
    }

    if (localLoginType === LoginTypeEnum.UNISAT) {
      try {
        const accounts = await window?.unisat?.getAccounts()
        const publicKey = await window?.unisat?.getPublicKey()

        if (!validateTaprootAddress(accounts?.[0])) return

        setAccountInfo({
          address: accounts?.[0],
          publicKey
        })
      } catch (error) {
        console.error('fetch unisat accounts info error')
      } finally {
        setIsFetchingAccountsInfo(false)
      }
      return
    }

    clearConnectedInfo()
    setIsFetchingAccountsInfo(false)
  }, [clearConnectedInfo, localLoginType, setAccountInfo])

  useEffect(() => {
    if (localLoginType === LoginTypeEnum.OKX) {
      const v = window.okxwallet?.isConnected?.()
      setIsWalletConnected(v)
      return
    }

    if (localLoginType === LoginTypeEnum.UNISAT) {
      setIsWalletConnected(!!window.unisat?._isConnected)
      return
    }

    clearConnectedInfo()
    setIsWalletConnected(false)
    setIsFetchingAccountsInfo(false)
  }, [clearConnectedInfo, localLoginType])

  useEffect(() => {
    if (isWalletConnected === false) {
      clearConnectedInfo()
    }
  }, [isWalletConnected, clearConnectedInfo])

  useEffect(() => {
    if (isWalletConnected === true && !isConnected) {
      fetchAccountInfo()
    }
  }, [isWalletConnected, isConnected, fetchAccountInfo])

  return { isLoading }
}
