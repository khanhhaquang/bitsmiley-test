import { useConnectModal as useParticleConnect } from '@particle-network/btc-connectkit'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisconnect } from 'wagmi'

import { clearStorage } from '@/utils/storage'

export const useDisconnectAccount = () => {
  const navigate = useNavigate()
  const { disconnect: disConnectParticle } = useParticleConnect()
  const { disconnect: disconnectEvm, connectors } = useDisconnect()

  const disconnectWagmi = useCallback(() => {
    disconnectEvm(
      {
        connector: connectors[0]
      },
      {
        onSuccess: () => {
          clearStorage()
          navigate('/')
        },
        onError: (e) => {
          console.log('err', e)
        }
      }
    )
  }, [connectors, disconnectEvm, navigate])

  const disconnect = useCallback(() => {
    disconnectWagmi()
    disConnectParticle?.()
  }, [disConnectParticle, disconnectWagmi])

  return disconnect
}
