import { useDisconnectWallet } from '@mysten/dapp-kit'
import { useConnectModal as useParticleConnect } from '@particle-network/btc-connectkit'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisconnect } from 'wagmi'

import { clearStorage } from '@/utils/storage'

import { useStoreActions } from './useStoreActions'

export const useDisconnectAccount = () => {
  const navigate = useNavigate()
  const { setAirdropIsLoggedIn } = useStoreActions()
  const { disconnect: disConnectParticle } = useParticleConnect()
  const { disconnect: disconnectEvm, connectors } = useDisconnect()
  const { mutate: disconnectSui } = useDisconnectWallet()

  const disconnectWagmi = useCallback(() => {
    disconnectEvm(
      {
        connector: connectors[0]
      },
      {
        onSuccess: () => {
          setAirdropIsLoggedIn(false)
          clearStorage()
          navigate('/')
        },
        onError: (e) => {
          console.log('err', e)
        }
      }
    )
  }, [connectors, disconnectEvm, navigate, setAirdropIsLoggedIn])

  const disconnect = useCallback(() => {
    disconnectWagmi()
    disConnectParticle?.()
    disconnectSui?.()
  }, [disConnectParticle, disconnectWagmi, disconnectSui])

  return disconnect
}
