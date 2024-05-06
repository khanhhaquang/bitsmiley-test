import {
  useETHProvider,
  useConnector as useParticleConnector
} from '@particle-network/btc-connectkit'
import { useCallback, useEffect, useState } from 'react'
import { Connector, CreateConnectorFn, useConfig } from 'wagmi'
import { reconnect as reconnectWagmi } from 'wagmi/actions'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'
import { getLocalStorage } from '@/utils/storage'

import { useEvmConnectors } from './useEvmConnectors'
import { useUserInfo } from './useUserInfo'

const localLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)

export const useReconnectEvm = () => {
  const config = useConfig()
  const { isConnected: isEvmConnected } = useUserInfo()
  const {
    unisatConnector,
    okxWithParticleConnector,
    okxConnector,
    metaMaskConnector
  } = useEvmConnectors()
  const [isError, setIsError] = useState(false)
  const { evmAccount: particleEvmAddress } = useETHProvider()
  const { connect: connectParticle } = useParticleConnector()

  const reconnect = useCallback(
    (connector: CreateConnectorFn | Connector) => {
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
    console.log('🚀 ~ useEffect ~ isEvmConnected:', isEvmConnected)

    if (isEvmConnected || !!particleEvmAddress) return

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
      localLoginType === LoginType.OKX &&
      okxWithParticleConnector &&
      particleEvmAddress
    )
      reconnect(okxWithParticleConnector)
  }, [config, okxWithParticleConnector, particleEvmAddress, reconnect])

  useEffect(() => {
    if (
      localLoginType === LoginType.UNISAT &&
      unisatConnector &&
      particleEvmAddress
    )
      reconnect(unisatConnector)
  }, [particleEvmAddress, reconnect, unisatConnector])

  useEffect(() => {
    if (localLoginType === LoginType.METAMASK && metaMaskConnector) {
      reconnect(metaMaskConnector)
      return
    }

    if (localLoginType === LoginType.OKX_EVM && okxConnector) {
      reconnect(okxConnector)
      return
    }
  }, [metaMaskConnector, okxConnector, particleEvmAddress, reconnect])

  return { isError, setIsError }
}
