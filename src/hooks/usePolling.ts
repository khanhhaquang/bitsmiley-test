import { useCallback, useRef, useState } from 'react'

export const usePolling = <T, P>({
  request,
  shouldContinue,
  interval = 5000
}: {
  shouldContinue: (data?: T) => boolean
  request: (params: P) => Promise<{ data?: T }>
  interval?: number
}) => {
  const cancelRef = useRef(false)
  const isPollingRef = useRef(false)
  const resultRef = useRef<T>()
  const [isPolling, setIsPolling] = useState(false)

  const doPolling = async (params: P) => {
    setIsPolling(true)
    if (isPollingRef.current) return

    isPollingRef.current = true

    const pollNext = async () => {
      if (cancelRef.current) {
        isPollingRef.current = false
        cancelRef.current = false
        return
      }

      const res = await request(params)

      if (shouldContinue(res?.data)) {
        await new Promise((resolve) => setTimeout(resolve, interval))
        await pollNext()
      } else {
        setIsPolling(false)
        resultRef.current = res?.data
        isPollingRef.current = false
      }
    }

    await pollNext()
  }

  const cancelPolling = useCallback(() => {
    if (isPollingRef.current) {
      cancelRef.current = true
    }
  }, [])

  return { resultRef, doPolling, cancelPolling, isPolling }
}
