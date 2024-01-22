import { useEffect, RefObject } from 'react'

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: () => void,
  excludeParent: boolean = false
) => {
  const handleClick = ({ target }: MouseEvent) => {
    if (excludeParent && ref.current?.parentElement?.contains(target as Node))
      return

    if (ref.current && !ref.current.contains(target as Node)) {
      callback()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  })
}
