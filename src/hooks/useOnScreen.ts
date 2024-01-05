import { RefObject, useEffect, useMemo, useState } from 'react'

export const useOnScreen = (ref?: RefObject<HTMLElement> | null) => {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(() => {
    if (!ref) return null
    return new IntersectionObserver(([entry]) =>
      setIntersecting(entry.isIntersecting)
    )
  }, [ref])

  useEffect(() => {
    if (!ref?.current) return
    observer?.observe(ref.current)
    return () => observer?.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isIntersecting
}
