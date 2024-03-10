import { useCallback, useEffect, useState } from 'react'
import { reconnect as reconnectWagmi } from 'wagmi/actions'
import { CreateConnectorFn, useConfig } from 'wagmi'
import { useEvmConnectors } from './useEvmConnectors'
import { getLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { useUserInfo } from './useUserInfo'
import {
  useETHProvider,
  useConnector as useParticleConnector
} from '@particle-network/btc-connectkit'

const localLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)

const useReconnectEvm = () => {
  const config = useConfig()
  const { isConnected: isConnectedWagmi } = useUserInfo()
  const { unisatConnector, okxConnector, metaMaskConnector } =
    useEvmConnectors()
  const [isError, setIsError] = useState(false)
  const { evmAccount: particleEvmAddress } = useETHProvider()
  const { connect: connectParticle } = useParticleConnector()

  const reconnect = useCallback(
    (connector: CreateConnectorFn) => {
      reconnectWagmi(config, { connectors: [connector] })
        .then((result) => {
          console.log('reconnect: ', result)
        })
        .catch((e: unknown) => {
          console.log('reconnect error: ', e)
          setIsError(true)
        })
    },
    [config]
  )

  useEffect(() => {
    if (isConnectedWagmi || !!particleEvmAddress) return

    if (localLoginType === LoginType.OKX) {
      connectParticle('okx')
    }

    if (localLoginType === LoginType.UNISAT) {
      connectParticle('unisat')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      localLoginType !== LoginType.OKX ||
      !okxConnector ||
      !particleEvmAddress
    )
      return

    reconnect(okxConnector)
  }, [config, okxConnector, particleEvmAddress, reconnect])

  useEffect(() => {
    if (
      localLoginType !== LoginType.UNISAT ||
      !unisatConnector ||
      !particleEvmAddress
    )
      return

    reconnect(unisatConnector)
  }, [particleEvmAddress, reconnect, unisatConnector])

  useEffect(() => {
    if (localLoginType !== LoginType.METAMASK || !metaMaskConnector) return

    reconnect(metaMaskConnector)
  }, [metaMaskConnector, reconnect])

  return { isError, setIsError }
}

export default useReconnectEvm
