import { useEffect, useState } from 'react'
import { reconnect } from 'wagmi/actions'
import { injected } from 'wagmi/connectors'
import { useConfig } from 'wagmi'

const useReconnectEvm = () => {
  const config = useConfig()
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    reconnect(config, { connectors: [injected()] })
      .then((result) => {
        console.log('reconnect: ', result)
      })
      .catch((e) => {
        console.log(e)
        setIsError(true)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isError, setIsError }
}

export default useReconnectEvm
