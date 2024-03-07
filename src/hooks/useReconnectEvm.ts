import { useEffect, useMemo, useState } from 'react'
import { reconnect } from 'wagmi/actions'
import { useConfig } from 'wagmi'
import { useEvmConnectors } from './useEvmConnectors'
import { getLocalStorage } from '@/utils/storage'
import { LOCAL_STORAGE_KEYS } from '@/config/settings'
import { LoginType } from '@/types/common'

const useReconnectEvm = () => {
  const config = useConfig()
  const connectors = useEvmConnectors()
  const [isError, setIsError] = useState(false)

  const filteredConnectors = useMemo(() => {
    const localLoginType = getLocalStorage(LOCAL_STORAGE_KEYS.LOGIN_TYPE)
    if (localLoginType === LoginType.METAMASK) return [connectors.metamask]
    if (localLoginType === LoginType.OKX) return [connectors.okx]
    return []
  }, [connectors])

  useEffect(() => {
    if (!filteredConnectors.length) return

    reconnect(config, { connectors: filteredConnectors })
      .then((result) => {
        console.log('reconnect: ', result)
      })
      .catch((e: unknown) => {
        console.log('reconnect error: ', e)
        setIsError(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isError, setIsError }
}

export default useReconnectEvm
