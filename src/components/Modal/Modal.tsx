import { useEffect } from 'react'
import { createPortal } from 'react-dom'

import { cn } from '@/utils/cn'

type TProps = {
  isOpen?: boolean
  className?: string
  onClose?: () => void
  closeIconColor?: string
  children?: React.ReactNode
}

export const Modal: React.FC<TProps> = ({
  isOpen,
  className,
  onClose,
  children
}) => {
  useEffect(() => {
    if (isOpen) {
      const handleEsc = (event: KeyboardEvent) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          onClose?.()
        }
      }

      window.addEventListener('keydown', handleEsc)
      document.querySelector('body')?.classList.add('no-scroll');

      return () => {
        window.removeEventListener('keydown', handleEsc)
        document.querySelector('body')?.classList.remove('no-scroll');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      className={cn(
        'fixed left-0 right-0 bottom-0 top-0 w-screen z-50 h-screen animation-all',
        className
      )}>
      {children}
    </div>,
    document.querySelector('#smiley-modals')!
  )
}
