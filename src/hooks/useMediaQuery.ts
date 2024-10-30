import { useEffect, useState } from 'react'

const getInitialState = (query: string, defaultState?: boolean) => {
  // Prevent a React hydration mismatch when a default value is provided by not defaulting to window.matchMedia(query).matches.
  if (defaultState !== undefined) {
    return defaultState
  }

  if (typeof window !== 'undefined') {
    return window.matchMedia(query).matches
  }

  return false
}

const useMedia = (query: string, defaultState?: boolean) => {
  const [state, setState] = useState(getInitialState(query, defaultState))

  useEffect(() => {
    let mounted = true
    const mql = window.matchMedia(query)
    const onChange = () => {
      if (!mounted) {
        return
      }
      setState(!!mql.matches)
    }

    mql.addEventListener('change', onChange)
    setState(mql.matches)

    return () => {
      mounted = false
      mql.removeEventListener('change', onChange)
    }
  }, [query])

  return state
}

export const useMediaQuery = () => {
  const isMobile = useMedia(`(max-width: 639px)`)
  return { isMobile }
}
