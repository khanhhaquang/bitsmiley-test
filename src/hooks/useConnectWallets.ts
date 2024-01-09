import { useSelector } from 'react-redux'
import { useStoreActions } from '@/hooks/useStoreActions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { useCallback, useEffect } from 'react'
import { getLoginType } from '@/store/account/reducer'
import { WALLETSITE } from '@/config/links'
import { clearStorage } from '@/utils/storage.ts'

export const useConnectWallets = () => {
  const loginType = useSelector(getLoginType)
  const { setAccountInfo, setLoginType } = useStoreActions()

  const handleAccountChanged = useCallback(
    (newAccountInfo: IAccountInfo | null, loginType: LoginTypeEnum) => {
      if (!newAccountInfo) {
        setAccountInfo({
          address: '',
          publicKey: ''
        })
        setLoginType(LoginTypeEnum.None)
        clearStorage()
        return
      }

      setAccountInfo(newAccountInfo)
      setLoginType(loginType)
    },
    [setAccountInfo, setLoginType]
  )

  const connectOkx = async () => {
    if (typeof window.okxwallet === 'undefined') {
      window.open(WALLETSITE.okx, '__blank')
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
      window.open(WALLETSITE.unisat, '__blank')
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
