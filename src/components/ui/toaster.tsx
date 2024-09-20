import { useCallback } from 'react'

import { FailIcon, SmileyIcon } from '@/assets/icons'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components//ui/toast'
import { useToast } from '@/components//ui/use-toast'
import { Image } from '@/components/Image'
import { cn } from '@/utils/cn'
import { getIllustrationUrl } from '@/utils/getAssetsUrl'

import { TransactionToasts } from './TransactionToasts'

export function Toaster() {
  const { toasts } = useToast()
  const getIcon = useCallback(
    (
      variant:
        | 'default'
        | 'destructive'
        | 'success'
        | 'processing'
        | 'error'
        | null
        | undefined
    ) => {
      if (variant === 'destructive') return <FailIcon width={28} height={24} />
      if (variant === 'processing')
        return (
          <Image
            src={getIllustrationUrl('loading-white-icon', 'webp')}
            width={26}
            height={26}
          />
        )
      if (variant === 'error')
        return <SmileyIcon className="text-warning" width={26} height={28} />
      return <SmileyIcon className="text-green" width={26} height={28} />
    },
    []
  )
  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        variant,
        description,
        action,
        className,
        disableClose,
        ...props
      }) {
        return (
          <Toast
            key={id}
            {...props}
            className={cn('flex gap-x-4 px-4', className)}>
            {getIcon(variant)}
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            {!disableClose && <ToastClose className="right-4 top-3" />}
          </Toast>
        )
      })}
      <TransactionToasts />
      <ToastViewport />
    </ToastProvider>
  )
}
