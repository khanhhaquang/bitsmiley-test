import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginTypeEnum } from '@/types/common'
import { clearLoginType, getLocalStorage } from '@/utils/storage'
import { useCallback, useEffect, useState } from 'react'
import { useStoreActions } from './useStoreActions'
import { useSelector } from 'react-redux'
import { getIsConnected } from '@/store/account/reducer'

export const useIsWalletUnlocked = () => {
  const [isFetchingAccountsInfo, setIsFetchingAccountsInfo] = useState(true)
  const [isUnlocked, setIsUnlocked] = useState<boolean | undefined>()
  const { setAccountInfo, setLoginType } = useStoreActions()
  const localLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)
  const isConnected = useSelector(getIsConnected)

  const isLoading = isUnlocked === undefined || isFetchingAccountsInfo

  const clearConnectedInfo = useCallback(() => {
    setAccountInfo({
      address: '',
      publicKey: ''
    })
    setLoginType(LoginTypeEnum.None)
    clearLoginType()
  }, [setAccountInfo, setLoginType])

  const fetchAccountInfo = useCallback(async () => {
    if (localLoginType === LoginTypeEnum.OKX) {
      try {
        const accounts = await window?.okxwallet?.bitcoin.getAccounts()
        const publicKey = await window?.okxwallet?.bitcoin.getPublicKey()
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
      window.okxwallet?.isUnlock?.().then((v) => setIsUnlocked(v))
      return
    }

    if (localLoginType === LoginTypeEnum.UNISAT) {
      setIsUnlocked(!!window.unisat?._isUnlocked)
      return
    }

    clearConnectedInfo()
    setIsUnlocked(false)
    setIsFetchingAccountsInfo(false)
  }, [clearConnectedInfo, localLoginType])

  useEffect(() => {
    if (isUnlocked === false) {
      clearConnectedInfo()
    }
  }, [isUnlocked, clearConnectedInfo])

  useEffect(() => {
    if (isUnlocked === true && !isConnected) {
      fetchAccountInfo()
    }
  }, [isUnlocked, isConnected, fetchAccountInfo])

  return { isLoading }
}
