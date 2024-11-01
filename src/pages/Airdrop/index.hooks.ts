import { useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useSignMessage } from 'wagmi'

import { privateAxiosSetupInterceptors } from '@/config/axios'
import { useStoreActions } from '@/hooks/useStoreActions'
import { useUserInfo } from '@/hooks/useUserInfo'
import { UserService } from '@/services/user'
import { getIsLoggedIn } from '@/store/airdrop/reducer'
import { parseCachedToken, setCachedToken } from '@/utils/storage'

export const useAirdropLogin = () => {
  const isLoggedIn = useSelector(getIsLoggedIn)
  const { setAirdropIsLoggedIn } = useStoreActions()
  const { isConnected, address } = useUserInfo()
  const { signMessageAsync } = useSignMessage()

  const handleLogin = useCallback(async () => {
    try {
      if (address) {
        const signature = await signMessageAsync({
          message: 'bitSmiley login sign'
        })
        const data = await UserService.login.call({
          owner: address,
          signature: signature as string
        })

        if (data.code === 0) {
          setCachedToken(address, data.data.token)
          setAirdropIsLoggedIn(true)
        }
      }
    } catch (error) {
      console.log('🚀 ~ handleLogin ~ error:', error)
    }
  }, [address, setAirdropIsLoggedIn, signMessageAsync])

  useEffect(() => {
    privateAxiosSetupInterceptors(() => setAirdropIsLoggedIn(false))
  }, [setAirdropIsLoggedIn])

  useEffect(() => {
    const { address: cachedAddress, token: cachedToken } = parseCachedToken()
    if (isConnected && cachedAddress === address && cachedToken) {
      setAirdropIsLoggedIn(true)
      return
    }

    if (
      isConnected &&
      (!isLoggedIn || cachedAddress !== address || !cachedToken)
    ) {
      handleLogin()
    }
  }, [address, handleLogin, isConnected, isLoggedIn, setAirdropIsLoggedIn])
}
