import {
  useETHProvider,
  useConnector as useParticleConnector
} from '@particle-network/btc-connectkit'
import { useCallback, useEffect, useState } from 'react'
import { Connector, CreateConnectorFn, useConfig } from 'wagmi'
import { reconnect as reconnectWagmi } from 'wagmi/actions'

import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { useBtcConnectors } from '@/hooks/useBtcConnectors'
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
    bitgetWithParticleConnector,
    bybitWithParticleConnector,
    xverseWithParticleConnector
  } = useBtcConnectors()
  const { okxConnector, metaMaskConnector, bitgetConnector, bybitConnector } =
    useEvmConnectors()
  const [isError, setIsError] = useState(false)
  const { account: particleEvmAddress } = useETHProvider()
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
    if (isEvmConnected || !!particleEvmAddress) return

    switch (localLoginType) {
      case LoginType.OKX:
        connectParticle(LoginType.OKX)
        break
      case LoginType.UNISAT:
        connectParticle(LoginType.UNISAT)
        break
      case LoginType.BYBIT:
        connectParticle(LoginType.BYBIT)
        break
      case LoginType.BITGET:
        connectParticle(LoginType.BITGET)
        break
      case LoginType.XVERSE:
        connectParticle(LoginType.XVERSE)
        break
      default:
        break
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
    if (
      localLoginType === LoginType.BITGET &&
      bitgetWithParticleConnector &&
      particleEvmAddress
    )
      reconnect(bitgetWithParticleConnector)
  }, [particleEvmAddress, reconnect, bitgetWithParticleConnector])

  useEffect(() => {
    if (
      localLoginType === LoginType.BYBIT &&
      bybitWithParticleConnector &&
      particleEvmAddress
    )
      reconnect(bybitWithParticleConnector)
  }, [particleEvmAddress, reconnect, bybitWithParticleConnector])

  useEffect(() => {
    if (
      localLoginType === LoginType.XVERSE &&
      xverseWithParticleConnector &&
      particleEvmAddress
    )
      reconnect(xverseWithParticleConnector)
  }, [particleEvmAddress, reconnect, xverseWithParticleConnector])

  useEffect(() => {
    if (localLoginType === LoginType.METAMASK && metaMaskConnector) {
      reconnect(metaMaskConnector)
      return
    }
    if (localLoginType === LoginType.OKX_EVM && okxConnector) {
      reconnect(okxConnector)
      return
    }
    if (localLoginType === LoginType.BITGET_EVM && bitgetConnector) {
      reconnect(bitgetConnector)
      return
    }
    if (localLoginType === LoginType.BYBIT_EVM && bybitConnector) {
      reconnect(bybitConnector)
      return
    }
  }, [
    bitgetConnector,
    bybitConnector,
    metaMaskConnector,
    okxConnector,
    reconnect
  ])

  return { isError, setIsError }
}
