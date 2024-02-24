import { useEffect, useState } from 'react'
import { reconnect } from 'wagmi/actions'
import { injected } from 'wagmi/connectors'
import { config } from '@/config/wagmi'

const useReconnectEvm = () => {
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    reconnect(config, { connectors: [injected()] })
      .then((result) => {
        console.log(result)
      })
      .catch((e) => {
        console.log(e)
        setIsError(true)
      })
  }, [])

  return { isError, setIsError }
}

export default useReconnectEvm
