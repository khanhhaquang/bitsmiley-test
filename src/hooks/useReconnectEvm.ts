import { useEffect, useState } from 'react'
import { reconnect } from 'wagmi/actions'
import { useConfig } from 'wagmi'
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
  const connectors = useEvmConnectors()
  const [isError, setIsError] = useState(false)
  const { evmAccount: particleEvmAddress } = useETHProvider()
  const { connect: connectParticle } = useParticleConnector()

  useEffect(() => {
    if (
      localLoginType !== LoginType.OKX ||
      isConnectedWagmi ||
      !!particleEvmAddress
    )
      return

    connectParticle('okx')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      localLoginType !== LoginType.OKX ||
      !connectors.okx ||
      isConnectedWagmi ||
      !particleEvmAddress
    )
      return

    reconnect(config, { connectors: [connectors.okx] })
      .then((result) => {
        console.log('reconnect: ', result)
      })
      .catch((e: unknown) => {
        console.log('reconnect error: ', e)
        setIsError(true)
      })
  }, [config, connectors.okx, isConnectedWagmi, particleEvmAddress])

  useEffect(() => {
    if (localLoginType !== LoginType.METAMASK || !connectors.metamask) return

    reconnect(config, { connectors: [connectors.metamask] })
      .then((result) => {
        console.log('reconnect: ', result)
      })
      .catch((e: unknown) => {
        console.log('reconnect error: ', e)
        setIsError(true)
      })
  }, [config, connectors.metamask])

  return { isError, setIsError }
}

export default useReconnectEvm
