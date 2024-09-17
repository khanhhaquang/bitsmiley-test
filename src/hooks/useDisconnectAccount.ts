import { useConnectModal as useParticleConnect } from '@particle-network/btc-connectkit'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDisconnect } from 'wagmi'

import { clearStorage } from '@/utils/storage'

export const useDisconnectAccount = () => {
  const navigate = useNavigate()
  const { disconnect: disConnectParticle } = useParticleConnect()
  const { disconnect: disconnectEvm } = useDisconnect()

  const disconnect = useCallback(() => {
    disConnectParticle?.()
    disconnectEvm(
      {},
      {
        onSuccess: () => {
          clearStorage()
          navigate('/')
        }
      }
    )
  }, [disConnectParticle, disconnectEvm, navigate])

  return disconnect
}
