import { useStoreActions } from '@/hooks/useStoreActions'
import { IAccountInfo, LoginTypeEnum } from '@/types/common'
import { useEffect } from 'react'

export const useConnectWallets = () => {
  const { setAccountInfo, setLoginType } = useStoreActions()

  const connectOkxwallet = async () => {
    if (typeof window.okxwallet === 'undefined') {
      console.log('OKX is not installed!')
      return
    }

    try {
      const accountInfo = await window.okxwallet.bitcoin.connect()
      setAccountInfo(accountInfo)
      setLoginType(LoginTypeEnum.OKX)
    } catch (error) {
      console.error('okx connect error')
    }
  }

  useEffect(() => {
    window.okxwallet?.bitcoin.on(
      'accountChanged',
      (addressInfo: IAccountInfo | null) => {
        if (!addressInfo) {
          setAccountInfo({
            address: '',
            publicKey: '',
            compressedPublicKey: ''
          })
          setLoginType(LoginTypeEnum.None)
          return
        }

        setAccountInfo(addressInfo)
      }
    )
  }, [setLoginType, setAccountInfo])

  return { connectOkxwallet }
}
