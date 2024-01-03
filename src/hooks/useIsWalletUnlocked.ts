import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginTypeEnum } from '@/types/common'
import { getLocalStorage } from '@/utils/storage'
import { useCallback, useEffect, useState } from 'react'
import { useStoreActions } from './useStoreActions'

export const useIsWalletUnlocked = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean | undefined>()
  const { setAccountInfo, setLoginType } = useStoreActions()
  const localLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)

  const clearConnectedInfo = useCallback(() => {
    setAccountInfo({
      address: '',
      publicKey: '',
      compressedPublicKey: ''
    })
    setLoginType(LoginTypeEnum.None)
  }, [setAccountInfo, setLoginType])

  useEffect(() => {
    if (localLoginType === LoginTypeEnum.OKX) {
      window.okxwallet?.isUnlock?.().then((v) => setIsUnlocked(v))
      return
    }

    if (localLoginType === LoginTypeEnum.UNISAT) {
      setIsUnlocked(!!window.unisat?._isUnlocked)
      return
    }

    setIsUnlocked(false)
    clearConnectedInfo()
  }, [clearConnectedInfo, localLoginType])

  useEffect(() => {
    if (isUnlocked === false) {
      clearConnectedInfo()
    }
  }, [isUnlocked, clearConnectedInfo])

  return { isLoading: isUnlocked === undefined }
}
