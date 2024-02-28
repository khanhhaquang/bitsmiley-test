import { useEffect, useState } from 'react'
import { reconnect } from 'wagmi/actions'
import { useConfig } from 'wagmi'
import { connectors } from '@/config/wagmi'

const useReconnectEvm = () => {
  const config = useConfig()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    reconnect(config, { connectors: [connectors.okx, connectors.metamask] })
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
