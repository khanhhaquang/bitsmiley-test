import { useSelector } from 'react-redux'
import { useQueryClient } from 'react-query'
import { useStoreActions } from '@/hooks/useStoreActions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { useCallback, useEffect } from 'react'
import { getLoginType } from '@/store/account/reducer'
import { WALLETSITE } from '@/config/links'
import { clearLoginType } from '@/utils/storage.ts'
import { openUrl } from '@/utils/getAssetsUrl'

export const useConnectWallets = () => {
  const queryClient = useQueryClient()
  const loginType = useSelector(getLoginType)
  const { setAccountInfo, setLoginType, resetStorage } = useStoreActions()

  const handleAccountChanged = useCallback(
    (newAccountInfo: IAccountInfo | null, loginType: LoginTypeEnum) => {
      if (!newAccountInfo) {
        resetStorage()
        clearLoginType()
        return
      }

      resetStorage()
      queryClient.clear()
      setAccountInfo(newAccountInfo)
      setLoginType(loginType)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resetStorage, setAccountInfo, setLoginType]
  )

  const connectOkx = async () => {
    if (typeof window.okxwallet === 'undefined') {
      openUrl(WALLETSITE.okx)
      return
    }

    try {
      const accountInfo = await window.okxwallet.bitcoin.connect()
      handleAccountChanged(
        { address: accountInfo.address, publicKey: accountInfo.publicKey },
        LoginTypeEnum.OKX
      )
    } catch (error) {
      console.error('okx connect error')
    }
  }

  const connectUnisat = async () => {
    if (typeof window.unisat === 'undefined') {
      openUrl(WALLETSITE.unisat)
      return
    }

    try {
      const accounts: string[] = await window.unisat.requestAccounts()
      const publicKey = await window.unisat.getPublicKey()
      if (accounts[0]) {
        handleAccountChanged(
          {
            address: accounts[0],
            publicKey
          },
          LoginTypeEnum.UNISAT
        )
      }
    } catch (error) {
      console.error('unisat connect error')
    }
  }

  const disConnect = () => {
    handleAccountChanged(null, LoginTypeEnum.None)
  }

  useEffect(() => {
    if (!window.okxwallet || loginType !== LoginTypeEnum.OKX) return

    const handleChange = (accountInfo: IAccountInfo) => {
      handleAccountChanged(accountInfo, LoginTypeEnum.OKX)
    }

    window.okxwallet.bitcoin.on('accountChanged', handleChange)

    return () => {
      window.okxwallet?.bitcoin.removeListener('accountChanged', handleChange)
    }
  }, [handleAccountChanged, loginType])

  useEffect(() => {
    if (!window.unisat || loginType !== LoginTypeEnum.UNISAT) return

    const handleChange = async (accounts: string[]) => {
      const newPublicKey = await window.unisat.getPublicKey()
      handleAccountChanged(
        {
          address: accounts[0],
          publicKey: newPublicKey
        },
        LoginTypeEnum.UNISAT
      )
    }

    window.unisat.on('accountsChanged', handleChange)

    return () => {
      window.unisat?.removeListener('accountsChanged', handleChange)
    }
  }, [handleAccountChanged, loginType])

  return { connectOkx, connectUnisat, disConnect }
}
