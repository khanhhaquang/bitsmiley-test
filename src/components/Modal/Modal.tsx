import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/utils/cn'
import { useClickOutside } from '@/hooks/useClickOutside'

type TProps = {
  isOpen?: boolean
  className?: string
  onClose?: () => void
  backdrop?: boolean
  closeIconColor?: string
  children?: React.ReactNode
}

export const Modal: React.FC<TProps> = ({
  isOpen,
  className,
  onClose,
  backdrop = true,
  children
}) => {
  const innerRef = useRef<HTMLDivElement>(null)

  useClickOutside(innerRef, () => {
    if (backdrop) {
      onClose?.()
    }
  })

  useEffect(() => {
    if (isOpen) {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          onClose?.()
        }
      }

      window.addEventListener('keydown', handleEsc)
      document.querySelector('body')?.classList.add('no-scroll')

      return () => {
        window.removeEventListener('keydown', handleEsc)
        document.querySelector('body')?.classList.remove('no-scroll')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className={cn(
        'fixed left-0 right-0 bottom-0 top-0 w-screen z-[100] h-screen animation-all',
        className
      )}>
      <div className="flex h-full w-full items-center justify-center bg-black2/80 text-white">
        <div ref={innerRef}>{children}</div>
      </div>
    </div>,
    document.querySelector('#smiley-modals')!
  )
}
